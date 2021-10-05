// @ts-check

import dat from '../dat.gui.js';
import { degToRad } from '../math.js';

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

    const lightFolder = gui.addFolder('light');
    lightFolder.add(state.light, 'x', -500, 500).onChange((v) => {
        state.light.x = v;
        cb();
    });
    lightFolder.add(state.light, 'y', -500, 500).onChange((v) => {
        state.light.y = v;
        cb();
    });
    lightFolder.add(state.light, 'z', -500, 500).onChange((v) => {
        state.light.z = v;
        cb();
    });
    lightFolder.add(state.light, 'shininess', 0, 10).onChange((v) => {
        state.light.shininess = v;
        cb();
    });
    lightFolder.add(state.light, 'spotLimit', 0, 180).onChange((v) => {
        state.light.spotLimit = v;
        cb();
    });
    lightFolder.add(state.light, 'rotX', -Math.PI, Math.PI).onChange((v) => {
        state.light.rotX = v;
        cb();
    });
    lightFolder.add(state.light, 'rotY', -Math.PI, Math.PI).onChange((v) => {
        state.light.rotY = v;
        cb();
    });
    lightFolder.add(state.light, 'rotZ', -Math.PI, Math.PI).onChange((v) => {
        state.light.rotZ = v;
        cb();
    });

    const lightColorFolder = lightFolder.addFolder('color');
    lightColorFolder.add(state.light.color, 'r', 0, 1).onChange((v) => {
        state.light.color.r = v;
        cb();
    });
    lightColorFolder.add(state.light.color, 'g', 0, 1).onChange((v) => {
        state.light.color.g = v;
        cb();
    });
    lightColorFolder.add(state.light.color, 'b', 0, 1).onChange((v) => {
        state.light.color.b = v;
        cb();
    });

    const lightSpecularColor = lightFolder.addFolder('specularColor');
    lightSpecularColor.add(state.light.specularColor, 'r', 0, 1).onChange((v) => {
        state.light.specularColor.r = v;
        cb();
    });
    lightSpecularColor.add(state.light.specularColor, 'g', 0, 1).onChange((v) => {
        state.light.specularColor.g = v;
        cb();
    });
    lightSpecularColor.add(state.light.specularColor, 'b', 0, 1).onChange((v) => {
        state.light.specularColor.b = v;
        cb();
    });

    return gui;
}