const { extend } = require('lodash');
const request = require('request-promise');

function CreateCreateRequest(content, options, filename) {
    const req = request({
        uri: `https://playcanvas.com/api/assets`,
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${options.bearer}`
        }
    });

    let form = req.form();
    form.append("projectId", "" + options.projectId);
    form.append("name", `${filename.path}`);
    form.append("asset", `${filename.assetId}`);
    form.append("data", JSON.stringify({ order: filename.priority || 100, scripts: {} }));
    form.append("preload", typeof filename.preload === "boolean" ? `${filename.preload}` : "true");
    form.append("file", content, {
        filename: filename.path,
        contentType: "text/javascript"
    });

    if (options.branchId) {
        form.append("branchId", "" + options.branchId);
    }

    return req;
}

function CreateUpdateRequest(content, options, filename) {
    const req = request({
        uri: `https://playcanvas.com/api/assets/${filename.assetId}`,
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${options.bearer}`
        }
    });

    let form = req.form()
    form.append("branchId", "" + options.branchId);
    form.append("file", content, {
        filename: filename.path,
        contentType: "text/javascript"
    });

    return req;
}

class PlayCanvasWebpackPlugin {
    constructor(options) {
        this.options = extend({
            files: {},
            mode: 'create'
        }, options);
    }

    apply(compiler) {
        let options = this.options;

        const logger = compiler.getInfrastructureLogger(this.constructor.name);

        compiler.hooks.shouldEmit.tap('PlayCanvasWebpackPlugin', compilation => {

            try {
                if (options.skipUpload) {
                    logger.info("Skipping Upload");
                    return false;
                }

                compilation.getAssets().forEach(asset => {
                    const filename = options.files[asset.name];
                    if (filename) {
                        if (!options.projectId) {
                            throw new Error("No projectId, aborting " + filename.path);
                        }
                        if (!filename.assetId) {
                            throw new Error("No assetId aborting " + filename.path);
                        }
                        if (!options.bearer) {
                            throw new Error("No bearer token, aborting");
                        }

                        logger.info("Uploading " + filename.path + " ...");

                        let req = options.mode === 'update'
                            ? CreateUpdateRequest(asset.source.buffer(), options, filename)
                            : CreateCreateRequest(asset.source.buffer(), options, filename);

                        req.then((data) => {
                            logger.info("File " + filename.path + " uploaded");
                        }, (e) => {
                            logger.error(e);
                        });
                    }
                });
            } catch (e) {
                logger.error(e);
            }

            return false;
        });
    }

}

module.exports = PlayCanvasWebpackPlugin;
