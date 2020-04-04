// @ts-check
import _ from 'lodash';

export default (...dictionaries) => {
  return dictionaries
    .reduce((acc, obj) => [...acc, ...Object.entries(obj)], [])
    .reduce((acc, [key, value]) => {
      if (_.has(acc, key)) {
        return { ...acc, [key]: _.uniq([ ...acc[key], value ]) };
      } 
      return { ...acc, [key]: [value] }; 
    }, {});
};