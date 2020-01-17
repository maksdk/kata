//@ts-check
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
// import _ from 'lodash';

// import { watch } from 'melanke-watchjs';
import axios from "axios";

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

const setStates = {
    "name": (value, state) => {
        state.name.value = value;
        state.name.error = "";

        if (value === "") {
            state.name.state = "empty";
        }
        else {
           state.name.state = "valid"; 
        }
    },
    "email": (value, state) => {
        state.email.value = value;
        state.email.error = "";

        if (!value) {
          state.email.state = 'empty';
        }
        else if (!/\S+@\S+\.\S+/.test(value)){ 
          state.email.state =  "invalid", 
          state.email.error = errorMessages.email.valid 
        }
        else {
          state.email.state =  "valid";
        }
    },
    "password": (value, state) => {
        state.password.value = value;
        state.password.error = "";

        if (!value) { 
          state.password.state = 'empty';
        }
        else if (value.length < 6) { 
          state.password.state = "invalid";
          state.password.error = errorMessages.password.length 
        }
        else if (value !== state.passwordConfirmation.value) { 
          state.password.state = "invalid"; 
          state.password.error = errorMessages.password.match 
        }
        else {
          state.password.state = "valid"; 
        }
    },
    "passwordConfirmation": (value, state) => {
        state.passwordConfirmation.value = value;
        state.passwordConfirmation.error = "";

        if (state.password.state === "invalid") return;

        if (!value) { 
          state.passwordConfirmation.state = 'empty';
        }
        else if (value.length < 6) { 
          state.passwordConfirmation.state = "invalid";
          state.passwordConfirmation.error = errorMessages.password.length 
        }
        else if (value !== state.password.value) { 
          state.passwordConfirmation.state = "invalid"; 
          state.passwordConfirmation.error = errorMessages.password.match 
        }
        else {
          state.passwordConfirmation.state = "valid"; 
        }
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
};

const renderForm = (state, form) => {
    const submit = form.elements[form.elements.length - 1];
    if (state.submit.state === "able") {
        submit.removeAttribute("disabled");
    }
    else if (state.submit.state === "disabled") {
        submit.setAttribute("disabled", "");
    }
    else if (state.submit.state === "sending") {
        submit.setAttribute("disabled", "");
        form.reset();

        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
    }
    else if (state.submit.state === "sent") {
        const container = document.querySelector('[data-container="sign-up"]');
        container.innerHTML = "";
        container.appendChild(document.createTextNode("User Created!"));
    }
}

const handleSubmit = async (event, state) => {
    event.preventDefault();
    
    state.submit.state = "sending";
    renderForm(state, event.target);
    
    const resullt = await axios({
        method: 'post',
        url: '/users',
        data: {},
        headers: {'Content-Type': 'multipart/form-data' }
    });

    state.submit.state = "sent";
    renderForm(state, event.target);
    
};  

const handleInput = (event, state) => {
    const { target } = event;
    const { name, value } = target;
    
    setStates[name](value, state);

    const checkValidForm = (state) => {
        for (let key in state) {
            if (state[key].state === "invalid" || state[key].state === "empty") return false;
        }
        return true;
    };

    render(state, target);

    if (checkValidForm(state)) {
        state.submit.state = "able";
    }
    else {
        state.submit.state = "disabled";
    }
    renderForm(state, target.form);
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

export default app;
// END
