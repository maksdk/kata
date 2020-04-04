// @ts-check
import _ from 'lodash';

const cons = (array, el) => _.union(array, [el]);

const merge = (result, dictionary) => _.mergeWith(result, dictionary, cons);

export default (...dictionaries) => dictionaries.reduce(merge, {});