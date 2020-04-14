import url from 'url';
import querystring from 'querystring';
import nock from 'nock';

import { get, post } from '../solution';

nock.disableNetConnect();

describe('HttpRequestPromise', () => {
  it('#get', async () => {
    const host = 'http://ru.hexlet.io';
    const status = 301;
    nock(host).get('/').reply(status);

    const response = await get(host);
    expect(response.status).toBe(status);
  });

  it('#get with params', async () => {
    const params = { a: 'v', d: 'k' };
    const host = 'http://ru.hexlet.io';
    const body = 'hello, world';
    nock(host)
      .get('/')
      .query(params)
      .reply(200, body);

    const response = await get(host, { params });
    expect(response.data).toBe(body);
  });

  it('#get with params and query', async () => {
    const params = { a: 'v', d: 'k' };
    const q = 'index';
    const host = 'http://ru.hexlet.io';
    const hostWithQuery = url.resolve(host, `/?q=${q}`);
    const body = 'hello, world';
    nock(host)
      .get('/')
      .query({ q, ...params })
      .reply(200, body);

    const response = await get(hostWithQuery, { params });
    expect(response.data).toBe(body);
  });

  it('#get 2', async () => {
    const host = 'http://ru.hexlet.io';
    const pathname = '/users/new';
    const body = 'hello, world';
    nock(host).get(pathname).reply(200, body);

    const response = await get(`${host}${pathname}`);
    expect(response.data).toBe(body);
  });

  it('#get 3', async () => {
    const host = 'http://ru.hexlet.io';
    const pathname = '/users/new';
    nock(host).get(pathname).replyWithError('timeout error');

    try {
      await get(`${host}${pathname}`);
      expect(false).toBe(true);
    } catch (e) {
      // everything is good
    }
  });

  it('#post', async () => {
    const host = 'http://ru.hexlet.io';
    const pathname = '/users';
    const data = { nickname: 'scooter' };
    const preparedData = querystring.stringify(data);
    const status = 302;
    nock(host, {
      reqheaders: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(preparedData),
      },
    }).post(pathname, preparedData).reply(status, data);

    const response = await post(`${host}${pathname}`, data);
    expect(response.status).toBe(status);
    expect(response).toHaveProperty('data', JSON.stringify(data));
  });
});
