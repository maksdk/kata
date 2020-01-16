// @ts-check
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import _ from 'lodash';

import {
    watch
} from 'melanke-watchjs';
import axios from 'axios';

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
const app = () => {};
export default app;
// END