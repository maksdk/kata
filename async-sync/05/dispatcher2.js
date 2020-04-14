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

const prepareData = (data, headers) => {
  if (data === undefined) {
    return [data, headers];
  }
  const preparedData = querystring.stringify(data);
  const bufferData = Buffer.from(preparedData, 'utf-8');
  return [bufferData, {
    ...headers,
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(bufferData),
  }];
};

export default (config) => {
  const [data, headers] = prepareData(config.data, config.headers || {});

  const urlObject = url.parse(config.url, true);
  const search = getSearch(urlObject.query, config.params);

  const options = {
    hostname: urlObject.hostname,
    port: urlObject.port,
    method: config.method,
    path: `${urlObject.pathname}${search}`,
    headers,
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      const responseData = [];
      res.on('data', (chunk) => {
        responseData.push(chunk);
      });

      res.on('end', () => {
        const response = {
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: res.headers,
          data: responseData.join(''),
        };

        resolve(response);
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(data);
    }
    req.end();
  });
};