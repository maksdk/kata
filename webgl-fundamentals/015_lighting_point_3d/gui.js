// @ts-check

import dat from '../dat.gui.js';

export function createGui(state, cb) {
    const gui = new dat.GUI();

    const targetFolder = gui.addFolder('target');
    targetFolder.add(state.target, 'rotX', -Math.PI * 2, Math.PI * 2).onChange((v) => {
        state.target.rotX = v;
        cb();
    });
    targetFolder.add(state.target, 'rotY', -Math.PI * 2, Math.PI * 2).onChange((v) => {
        state.target.rotY = v;
        cb();
    });
    targetFolder.add(state.target, 'rotZ', -Math.PI * 2, Math.PI * 2).onChange((v) => {
        state.target.rotZ = v;
        cb();
    });
    targetFolder.add(state.target, 'posX', -500, 500).onChange((v) => {
        state.target.posX = v;
        cb();
    });
    targetFolder.add(state.target, 'posY', -500, 500).onChange((v) => {
        state.target.posY = v;
        cb();
    });
    targetFolder.add(state.target, 'posZ', -500, 500).onChange((v) => {
        state.target.posZ = v;
        cb();
    });
    targetFolder.add(state.target, 'scaleX', -10, 10).onChange((v) => {
        state.target.scaleX = v;
        cb();
    });
    targetFolder.add(state.target, 'scaleY', -10, 10).onChange((v) => {
        state.target.scaleY = v;
        cb();
    });
    targetFolder.add(state.target, 'scaleZ', -10, 10).onChange((v) => {
        state.target.scaleZ = v;
        cb();
    });


    const cameraFolder = gui.addFolder('camera');
    cameraFolder.add(state.camera, 'x', -500, 500).onChange((v) => {
        state.camera.x = v;
        cb();
    });
    cameraFolder.add(state.camera, 'y', -500, 500).onChange((v) => {
        state.camera.y = v;
        cb();
    });
    cameraFolder.add(state.camera, 'z', -500, 500).onChange((v) => {
        state.camera.z = v;
        cb();
    });

    const pointLightFolder = gui.addFolder('pointLight');
    pointLightFolder.add(state.pointLight, 'x', -500, 500).onChange((v) => {
        state.pointLight.x = v;
        cb();
    });
    pointLightFolder.add(state.pointLight, 'y', -500, 500).onChange((v) => {
        state.pointLight.y = v;
        cb();
    });
    pointLightFolder.add(state.pointLight, 'z', -500, 500).onChange((v) => {
        state.pointLight.z = v;
        cb();
    });
    pointLightFolder.add(state.pointLight, 'shininess', 0, 10).onChange((v) => {
        state.pointLight.shininess = v;
        cb();
    });

    const pointLightColorFolder = pointLightFolder.addFolder('color');
    pointLightColorFolder.add(state.pointLight.color, 'r', 0, 1).onChange((v) => {
        state.pointLight.color.r = v;
        cb();
    });
    pointLightColorFolder.add(state.pointLight.color, 'g', 0, 1).onChange((v) => {
        state.pointLight.color.g = v;
        cb();
    });
    pointLightColorFolder.add(state.pointLight.color, 'b', 0, 1).onChange((v) => {
        state.pointLight.color.b = v;
        cb();
    });

    const pointLightSpecularColor = pointLightFolder.addFolder('specularColor');
    pointLightSpecularColor.add(state.pointLight.specularColor, 'r', 0, 1).onChange((v) => {
        state.pointLight.specularColor.r = v;
        cb();
    });
    pointLightSpecularColor.add(state.pointLight.specularColor, 'g', 0, 1).onChange((v) => {
        state.pointLight.specularColor.g = v;
        cb();
    });
    pointLightSpecularColor.add(state.pointLight.specularColor, 'b', 0, 1).onChange((v) => {
        state.pointLight.specularColor.b = v;
        cb();
    });

    return gui;
}