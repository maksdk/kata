import url from 'url';
import http from 'http';
import querystring from 'querystring';

const getToken = (body) => body.match(/value="(\w+)"/)[1];

const readToken = (href, cb) => {
  const chunks = [];

  http.get(href, (res) => {
    const { statusCode } = res;
    if (statusCode !== 200) {
      return cb(new Error(`STATUS: ${statusCode}`));
    }

    res.on('data', (chunk) => chunks.push(chunk.toString()));
    res.on('end', () => cb(null, getToken(chunks.join(''))));
    res.on('error', (error) => cb(new Error(error)));
  });
};

export default (registrationFormUrl, submitFormUrl, nickname, callback) => {
  // BEGIN (write your solution here)
  readToken(registrationFormUrl, (error, token) => {
    if (error) return callback(error);

    const postData = querystring.stringify({ nickname, token });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(submitFormUrl, options, (res) => {
      const { statusCode } = res;
      if (statusCode !== 302) {
        return callback(new Error(`STATUS: ${statusCode}`));
      }
      callback(null);
    });

    req.write(postData);
    req.end();
  });
  // END
};
