// @ts-check
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
// import _ from 'lodash';

// import {
//     watch
// } from 'melanke-watchjs';
// import axios from 'axios';

// Never hardcore urls
const routes = {
    usersPath: () => '/users',
}

const errorMessages = {
    email: {
        valid: 'Value is not a valid email',
    },
    password: {
        length: 'Must be at least 6 letters',
        match: 'Password confirmation does not match to password',
    },
};

// BEGIN (write your solution here)
const createErrorNode = (message) => {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(message));
    div.setAttribute("class", "invalid-feedback");
    return div;
};

const insertAfter = (newNode, referenceNode) => {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};

const mapValidates = {
    "name": (value) => {
        if (value === "") return { state: "empty" };
        return { state: "valid" }; 
    },
    "email": (value) => {
        if (!value) return { state: 'empty' };
        if (!/\S+@\S+\.\S+/.test(value)) return { state: "invalid", error: errorMessages.email.valid }; 
        return { state: "valid" };
    },
    "password": (value) => {
        if (!value) return { state: 'empty' };
        if (value.length < 6) return { state: "invalid", error: errorMessages.password.length };
        return { state: "valid" };
    },
    "passwordConfirmation": (value, globalState) => {
        const { password } = globalState;
        if (!value) return { state: "empty" };
        if (value !== password.value) return { state: "invalid", error: errorMessages.password.match };
        return { state: "valid" };
    }
};

const render = (state, target) => {
    const { name } = target;
    const targetState = state[name];

    const existedErrorNode = target.parentNode.querySelector(".invalid-feedback");
    if (existedErrorNode) {
        target.parentNode.removeChild(existedErrorNode);
    }

    if (targetState && targetState.state === "invalid") {
        target.classList.add("is-invalid"); 
        if (targetState.error) {
            const errorNode = createErrorNode(targetState.error);
            insertAfter(errorNode, target);
        } 
    }
    else {
        target.classList.remove("is-invalid");
    }

    const submit = target.form.elements[target.form.elements.length - 1];
    if (state.submit.state === "able") {
        submit.removeAttribute("disabled");
    }
    else {
        submit.setAttribute("disabled", true);
    }
};

const handleSubmit = (event, state) => {
    console.log("add logic for submit")
};  

const handleInput = (event, state) => {
    const { target } = event;
    const { name, value } = target;
    
    const { state: elemState, error="" } = mapValidates[name](value, state);

    state[name].state = elemState;
    state[name].value = value;
    state[name].error = error;

    const checkValidForm = (state) => {
        for (let key in state) {
            if (state[key].state === "invalid" || state[key].state === "empty") return false;
        }
        return true;
    };

    if (checkValidForm(state)) {
        state.submit.state = "able";
    }
    else {
        state.submit.state = "disabled";
    }

    render(state, target);
};  

const app = () => {
    const state = {
        submit: {
            state: "disabled"
        },
        name: {
            state: "empty",
            value: "",
            error: ""
        },
        email: {
            state: "empty",
            value: "",
            error: ""
        },
        password: {
            state: "empty",
            value: "",
            error: ""
        },
        passwordConfirmation: {
            state: "empty",
            value: "",
            error: ""
        }
    };

    const form = document.querySelector("[data-form='sign-up']");
    form.addEventListener("input", (e) => handleInput(e, state), false);
    form.addEventListener("submit", (e) => handleSubmit(e, state), false);
};
app()
// export default app;
// END