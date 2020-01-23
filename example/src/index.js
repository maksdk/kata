//@ts-check
import App from "./app/index";

window.addEventListener("load", () => {
    const app = new App();
    app.init();
    app.start();
});

