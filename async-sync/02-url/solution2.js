export default (address, params) => {
  const urlObject = url.parse(address, true);
  const mergedQuery = {
    ...urlObject.query,
    ...params
  };
  const query = Object.keys(mergedQuery)
    .filter((key) => mergedQuery[key] !== null)
    .reduce((acc, key) => ({
      ...acc,
      [key]: mergedQuery[key]
    }), {});

  return url.format({
    ...urlObject,
    query,
    search: null
  });
};