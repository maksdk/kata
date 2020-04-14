import dispatch from './dispatcher';

export const get = (url, config = {}) => dispatch({ ...config, url, method: 'GET' });
export const post = (url, data, config = {}) => dispatch({
  ...config,
  url,
  data,
  method: 'POST',
});

export default { get, post };
