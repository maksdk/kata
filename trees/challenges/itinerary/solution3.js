// @ts-check

import _ from 'lodash';

// BEGIN (write your solution here)
export default (tree, from, to) => {
  const mapRoutes = {
    [from]: [],
    [to]: []
  };

  const iter = (node, path) => {
    const [name, children=[]] = node;
    if (mapRoutes[name]) {
      mapRoutes[name] = [...path, name];
    } else {
      children.forEach((child) => iter(child, [...path, name]));
    }
  };

  iter(tree, [], []);
  
  return _.union(mapRoutes[from].reverse(), mapRoutes[to]);
}
// END
