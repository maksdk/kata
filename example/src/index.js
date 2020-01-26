//@ts-check
import Component from "./Component";

window.addEventListener("load", () => {
    const component = new Component();
    component.init();
    component.start();
});

