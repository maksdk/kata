export default (backendsListUrl, setCurrentBackendUrl) => get(backendsListUrl)
  .then((result) => {
    const data = JSON.parse(result.data);
    const promises = data.map(({ url }) => get(`${url}/status`));

    return Promise.all(promises);
  })
  .then((responses) => {
    const best = responses.map((v) => JSON.parse(v.data))
      .reduce((min, cur) => (cur.workload < min.workload ? cur : min), { workload: Infinity });
    return post(setCurrentBackendUrl, { value: best.url });
  });