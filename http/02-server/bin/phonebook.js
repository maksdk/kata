#!/usr/bin/env babel-node

import solution from '../server';

const port = 8080;
solution(port, () => {
    // eslint-disable-next-line no-console
    console.log('server started!');
});