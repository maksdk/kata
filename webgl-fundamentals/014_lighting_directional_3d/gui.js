// @ts-check

import dat from '../dat.gui.js';

export function createGui(state, cb) {
    const gui = new dat.GUI();

    gui.add(state, 'xRotation', -Math.PI * 2, Math.PI * 2).onChange((v) => {
        state.xRotation = v;
        cb();
    });

    gui.add(state, 'yRotation', -Math.PI * 2, Math.PI * 2).onChange((v) => {
        state.yRotation = v;
        cb();
    });

    gui.add(state, 'zRotation', -Math.PI * 2, Math.PI * 2).onChange((v) => {
        state.zRotation = v;
        cb();
    });

    return gui;
}