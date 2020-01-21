//@ts-check
import App from "./app";

window.addEventListener("load", () => {
    const app = new App();
    app.init();
    app.start();
});

