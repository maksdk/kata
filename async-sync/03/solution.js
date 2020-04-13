import url from 'url';
import http from 'http';

const getTitle = (body) => body.match(/<h1>(.*?)<\/h1>/)[1];
const getLinks = (body) => (body.match(/href="\/(.*?)">/g) || [])
  .map((item) => item.match(/href="\/(.*?)">/)[1]);

// BEGIN (write your solution here)
const mergeLinks = (state, links) => {
  state.linksQueue.push(...links.filter(l => !state.checkedLinks.includes(l)));
};

const useLink = (state, link) => {
  state.checkedLinks.push(link);
  state.linksQueue = state.linksQueue.filter(l => l !== link);
};

const getLink = (state) => state.linksQueue.pop();

const get = (options, state, cb) => {
  const href = url.format(options);
  
  http.get(href, (res) => {
    const chunks = [];

    res.on('data', (chunk) => chunks.push(chunk.toString()));
  
    res.on('end', () => {
      const body = chunks.join('');

      const links = getLinks(body);
      mergeLinks(state, links);

      const title = getTitle(body);
      if (title === state.title) return cb(null, options);

      const pathname = getLink(state);  
      if (!pathname) return cb('Title is not found', null);
      useLink(state, pathname);

      get({ ...options, pathname }, state, cb);
    });
  });
};

export default (title, href, cb) => {
  const state = {
    linksQueue: [],
    checkedLinks: [],
    title,
  };

  const parsedUrl = url.parse(href);

  get(parsedUrl, state, (error, options) => {
    if (error) return cb(error);
    cb(null, url.format({ ...parsedUrl, ...options }));
  });
};
// END
