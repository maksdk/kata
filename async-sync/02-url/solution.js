//@ts-check
import url from 'url';

export default (address, params) => {
  const {
    protocol,
    host,
    pathname,
    query
  } = url.parse(address, true);

  const fixedQuery = Object.entries({
      ...query,
      ...params
    })
    .reduce((acc, [key, value]) => {
      if (value === null) {
        return acc;
      }
      return {
        ...acc,
        [key]: value
      };
    }, {});

  const result = url.format({
    protocol,
    host,
    pathname,
    query: fixedQuery
  });
  return result;
};