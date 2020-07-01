import {
    promises as fs
} from 'fs';
import _ from 'lodash';
import path from 'path';

import makeServer from './server';

export default async (port, callback = () => {}) => {
    const data = await fs.readFile(path.resolve(__dirname, 'phonebook.txt'));

    // BEGIN (write your solution here)
    const usersById = data
        .toString()
        .trim()
        .split('\n')
        .reduce((acc, stroke) => {
            const [id, name, phone] = stroke.split('|').map((v) => v.trim());
            return {
                ...acc,
                [id]: {
                    name,
                    phone
                }
            };
        }, {});
    // END

    const server = makeServer(usersById);
    server.listen(port, () => callback(server));
};