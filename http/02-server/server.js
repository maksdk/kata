import {
    promises as fs
} from 'fs';
import path from 'path';
import http from 'http';

export default async (port, callback) => {
    const server = http.createServer(async (req, res) => {
        const phonebook = await fs.readFile(path.resolve(__dirname, 'phonebook.txt'), 'utf-8');

        const phonebookLength = phonebook
            .trim()
            .split('\n')
            .length;

        res.write(`Welcome to The Phonebook\nRecords count: ${phonebookLength}`);

        res.end();
    });

    server.listen(port, callback);
};