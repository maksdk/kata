// @ts-check
/* eslint-disable no-console */

import http from 'http';

export default (usersById) => http.createServer((request, response) => {
    request.on('error', (err) => {
        console.error(err.stack);
    });
    request.on('end', () => {
        if (request.url === '/') {
            const messages = [
                'Welcome to The Phonebook',
                `Records count: ${Object.keys(usersById).length}`,
            ];
            response.end(messages.join('\n'));
        } else if (request.url.startsWith('/search.json')) {
            response.setHeader('Content-Type', 'application/json');

            const url = new URL(request.url, `http://${request.headers.host}`);
            const q = url.searchParams.get('q');
            const normalizedSearch = q ? q.trim().toLowerCase() : '';

            const result = Object.values(usersById)
                .filter((user) => user.name.toLowerCase().includes(normalizedSearch));

            response.end(JSON.stringify(result));
        } else if (request.url.startsWith('/users.json')) {

            response.setHeader('Content-Type', 'application/json');

            const url = new URL(request.url, `http://${request.headers.host}`);
            const page = Number(url.searchParams.get('page') || 1);
            const perPage = Number(url.searchParams.get('perPage') || 10);

            const totalPages = Math.ceil(Object.keys(usersById).length / perPage);
            const meta = {
                page,
                perPage,
                totalPages
            };
            const data = [];

            const endIndex = page * perPage;
            const startIndex = endIndex - (perPage - 1);

            for (let i = startIndex; i <= endIndex; i += 1) {
                data.push(usersById[i]);
            }

            response.end(JSON.stringify({
                meta,
                data
            }));
        }
    });
    request.resume();
});