export default class Truncater {
    static defaultOptions = {
        separator: '...',
        length: 200,
    };

    // BEGIN (write your solution here)
    constructor(options = {}) {
        this.options = {
            ...Truncater.defaultOptions,
            ...options
        };
    }

    truncate(body, options = {}) {
        const config = {
            ...this.options,
            ...options
        };

        if (body.length > config.length) {
            return `${body.slice(0, config.length)}${config.separator}`;
        }

        return body;
    }
    // END
}