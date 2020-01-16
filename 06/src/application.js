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
const handleChangeName = (event) => {
console.log("handleChangeName")
console.log(event)
};

const handleChangeEmail = (event) => {
console.log("handleChangeEmail")
console.log(event)
};

const handleChangePassword = (event) => {
console.log("handleChangePassword")
console.log(event)
};

const handleChangeConfirmPassword = (event) => {
console.log("handleChangeConfirmPassword")
console.log(event)
};

const handleSubmit = (event) => {
console.log("handleSubmitnt")
console.log(event)
};  

const app = () => {
    const state = {
        form: {
            state: "idle",
            name: "",
            email: "",
            password: "",
            passwordConfirmation: ""
        }
    };

    const elements = {
        name: {
            elem: document.getElementById("sign-up-name"),
            event: "input",
            callback: handleChangeName
        },
        email: {
            elem: document.getElementById("sign-up-email"),
            event: "input",
            callback: handleChangeEmail
        },
        password: {
            elem: document.getElementById("sign-up-password"),
            event: "input",
            callback: handleChangePassword
        },
        passwordConfirmation: {
            elem: document.getElementById("sign-up-password-confirmation"),
            event: "input",
            callback: handleChangeConfirmPassword
        },
        form: {
            elem: document.querySelector('[data-form="sign-up"]'),
            event: "submit",
            callback: handleSubmit
        }
    };

    Object.values(elements)
        .forEach(props => {
            const { elem, event, callback } = props;
            elem.addEventListener(event, (e) => callback(e, state), false);
        });

};
app()
// export default app;
// END