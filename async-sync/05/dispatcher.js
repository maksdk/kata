import http from 'http';
import url from 'url';
import querystring from 'querystring';

const getSearch = (queryParams, params) => {
  const mergedQuery = { ...queryParams, ...params };
  const keys = Object.keys(mergedQuery);
  const newQueryParams = keys
    .filter((key) => mergedQuery[key] !== null && mergedQuery[key] !== undefined)
    .reduce((acc, key) => ({ ...acc, [key]: mergedQuery[key] }), {});

  return keys.length > 0 ? `?${querystring.stringify(newQueryParams)}` : '';
};

// BEGIN (write your solution here)
const mapRequest = {
  'POST': (config, resolve, reject) => {
    const { data, url: href, headers = {} } = config;

    const postData = querystring.stringify(data);

    const postHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
      ...headers
    };

    const req = http.request(href, { method: 'POST', headers: postHeaders }, (res) => {
      const { statusCode } = res;
      resolve({ status: statusCode, data: JSON.stringify(data) });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  },
  'GET': (config, resolve, reject) => {
    const { url: href, headers = {} } = config;

    const req = http.request(href, { method: 'GET', headers }, (res) => {
      const { statusCode } = res;
      const response = { status: statusCode };
      const chunks = [];

      res.on('data', (data) => chunks.push(data.toString()));
      res.on('end', () => resolve({ ...response, data: chunks.join('') }));
      res.on('error', reject);
    });

    req.on('error', reject);
    req.end();
  }
};

export default (config) => {
  const { method, url: href, params = {}, ...restConfig } = config;

  const { query, ...rest} = url.parse(href, true);
  const search = getSearch(query, params);

  const newHref = url.format({ ...rest, search });

  const request = mapRequest[method.toUpperCase()];
  return new Promise((resolve, reject) => 
    request({ url: newHref, ...restConfig }, resolve, reject));
};
// END
