import _ from 'lodash';
import read from './read';
import render from './renderers';

const formats = ['structured', 'plain'];
export const defaultFormat = formats[0];

const statuses = {
  same: 'same',
  updated: 'updated',
  added: 'added',
  removed: 'removed',
  nested: 'nested',
};

const makeTree = (data1, data2) => {
  const makeTemplate = (name, status, children, oldValue, newValue) => ({
    name,
    status,
    children,
    oldValue,
    newValue,
  });

  const iter = (obj1, obj2) => {
    const keys = _.union(Object.keys(obj1), Object.keys(obj2));

    const ast = keys.map((key) => {
      const value1 = obj1[key];
      const value2 = obj2[key];

      if (_.has(obj1, key) && _.has(obj2, key)) {
        if (value1 instanceof Object && value2 instanceof Object) {
          const children = iter(value1, value2);
          return makeTemplate(key, statuses.nested, children);
        } else if (value1 === value2) {
          return makeTemplate(key, statuses.same, [], value1);
        }

        return makeTemplate(key, statuses.updated, [], value1, value2);
      } else if (_.has(obj1, key)) {
        return makeTemplate(key, statuses.removed, [], value1);
      }
      return makeTemplate(key, statuses.added, [], undefined, value2);
    });

    return ast;
  };

  const children = iter(data1, data2);
  return makeTemplate('', statuses.nested, children);
};

const diff = (first, second, format = defaultFormat) => {
  if (!formats.includes(format)) {
    throw new Error('unknown format');
  }

  const data1 = read(first);
  const data2 = read(second);

  const tree = makeTree(data1, data2);
  const result = render(tree, format);
  return result;
};

export default diff;

const b = '/Users/igor/Documents/Dev/Hexlet/project2/__tests__/__fixtures__/before.ini';
const a = '/Users/igor/Documents/Dev/Hexlet/project2/__tests__/__fixtures__/after.ini';

console.log(diff(b, a, 'plain'));
