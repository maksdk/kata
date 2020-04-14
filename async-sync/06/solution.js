import { get, post } from '@hexlet/http-request';

// BEGIN (write your solution here)
const getParsed = (url) => get(url).then((res) => JSON.parse(res.data));

export default async (backendsListUrl, setCurrentBackendUrl) => {
  return getParsed(backendsListUrl)
    .then((backendsList) => backendsList.map(({url}) => url))
    .then((backendsUrls) => {
      const statusUrlList = backendsUrls.map((url) => `${url}/status`);
      return Promise.all(statusUrlList.map((url) => getParsed(url)));
    })
    .then((statuslist) => {
      let minWorkload = Infinity;
      let minWorkloadUrl = null;
      statuslist.forEach(({ workload, url }) => {
        if (workload < minWorkload) {
          minWorkload = workload;
          minWorkloadUrl = url;
        }
      });
      return minWorkloadUrl;
    })
    .then((url) => post(setCurrentBackendUrl, { value: url }));
};
// END
