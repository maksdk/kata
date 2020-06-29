import axios from 'axios';

import server from '../server';

const hostname = 'http://localhost';
const port = 9000;
const url = `${hostname}:${port}`;

describe('Phonebook', () => {
    it('GET /', (done) => {
        server(port, async () => {
            try {
                const res = await axios.get(url);
                expect(res.data).toBe('Welcome to The Phonebook\nRecords count: 1000');
                done();
            } catch (e) {
                done.fail(e);
            }
        });
    });
});