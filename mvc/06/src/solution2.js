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

// BEGIN
const validate = (fields) => { // pure function
    const errors = {};
    if (fields.email && !fields.email.includes('@')) {
        errors.email = errorMessages.email.valid;
    }
    if (fields.password.length < 6) {
        errors.password = errorMessages.password.length;
    } else if (fields.password !== fields.passwordConfirmation) {
        errors.password = errorMessages.password.match;
    }

    return errors;
};

const updateValidationState = (state) => {
    const errors = validate(state.form.fields);
    state.form.errors = errors;
    state.form.valid = _.isEqual(errors, {});
}

export default () => {
    const state = {
        form: {
            processState: 'filling',
            fields: {
                name: '',
                email: '',
                password: '',
                passwordConfirmation: '',
            },
            valid: false,
            errors: {},
        },
    };

    const container = document.querySelector('[data-container="sign-up"]');
    const form = document.querySelector('[data-form="sign-up"]');
    const fieldElements = {
        name: document.getElementById('sign-up-name'),
        email: document.getElementById('sign-up-email'),
        password: document.getElementById('sign-up-password'),
        passwordConfirmation: document.getElementById('sign-up-password-confirmation'),
    };
    const submitButton = form.querySelector('input[type="submit"]');

    Object.entries(fieldElements).forEach(([name, element]) => {
        element.addEventListener('input', (e) => {
            state.form.fields[name] = e.target.value;
            updateValidationState(state);
        });
    });

    watch(state.form, 'errors', () => {
        Object.entries(fieldElements).forEach(([name, element]) => {
            const errorElement = element.nextElementSibling;
            const errorMessage = state.form.errors[name];
            const value = state.form.fields[name];
            if (errorElement) {
                element.classList.remove('is-invalid');
                errorElement.remove();
            }
            if (!errorMessage || value === '') {
                return;
            }
            const feedbackElement = document.createElement('div');
            feedbackElement.classList.add('invalid-feedback');
            feedbackElement.innerHTML = errorMessage;
            element.classList.add('is-invalid');
            element.after(feedbackElement);
        });
    });

    watch(state.form, 'processState', () => {
        const {
            processState
        } = state.form;
        switch (processState) {
            case 'filling':
                submitButton.disabled = false;
                break;
            case 'sending':
                submitButton.disabled = true;
                break;
            case 'finished':
                container.innerHTML = 'User Created!';
                break;
            default:
                throw new Error(`Unknown state: ${processState}`)
        }
    });

    watch(state.form, 'valid', () => {
        submitButton.disabled = !state.form.valid;
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        state.form.processState = 'sending';
        try {
            await axios.post(routes.usersPath(), state.form.fields);
            state.form.processState = 'finished';
        } catch (e) {
            // TODO: Real behavior depends on the status code of response
            state.form.errors.base = 'Network Problems. Try again.';
            state.form.processState = 'filling';
            throw e;
        }
    });
};
// END