//@ts-check

const createForm = (name, value) => {
    const form = document.createElement("form");

    const inputText = document.createElement("input");
    inputText.setAttribute("type", "text");
    inputText.setAttribute("name", name);
    inputText.setAttribute("value", value);
    form.appendChild(inputText);
    //@ts-ignore
    inputText.focus();
    //@ts-ignore
    inputText.select();

    const inputsubmit = document.createElement("input");
    inputsubmit.setAttribute("type", "submit");
    inputsubmit.setAttribute("value", "Save");
    form.appendChild(inputsubmit);

    return form;
};

const render = (state) => {
    const { currentTarget, currentState, targets } = state;

    if (currentState === "focus") {
        const { value } = targets[currentTarget];
        const target = document.querySelector(`[data-editable-target=${currentTarget}]`);
        [...target.children].forEach(child => child.remove());
        target.appendChild(createForm(currentTarget, value));
    }
};

const app = () => {
    const state = { 
        currentTarget: null,
        currentState: "idle",
        targets: {
            name: {
                value: "name"
            },
            email: {
                value: "email"
            }
        }
    };

    const name = document.querySelector('[data-editable-target="name"]');
    const email = document.querySelector('[data-editable-target="email"]'); 

    const handleOnClick = (e) => {
        const { currentTarget } = e;
        const { targets } = state;
        const currentTargetType = currentTarget.getAttribute("data-editable-target");

        if (targets[currentTargetType]) {
            state.currentTarget = currentTargetType;
            state.currentState = "focus";
        } 

        render(state);
    };

    name.addEventListener("click", handleOnClick, false);
    email.addEventListener("click", handleOnClick, false);
};

window.addEventListener("load", () => {
    app();
});

// export default app;