import _ from 'lodash';
import fs from 'fs';
import path from 'path';

import parsers from './parsers';
import render, { formats } from './renderers';

export const defaultFormat = formats[0];

const makeTree = (data1, data2) => {
  const iter = (obj1, obj2) => {
    const keys = _.union(Object.keys(obj1), Object.keys(obj2));

    const ast = keys.map((key) => {
      const oldValue = obj1[key];
      const newValue = obj2[key];

      const name = key;

      if (_.has(obj1, key) && _.has(obj2, key)) {
        if (oldValue instanceof Object && newValue instanceof Object) {
          const children = iter(oldValue, newValue);
          const status = 'nested';
          return { name, status, children };
        } else if (oldValue === newValue) {
          const status = 'same';
          return { name, status, oldValue };
        }

        const status = 'updated';
        return {
          name, status, oldValue, newValue,
        };
      } else if (_.has(obj1, key)) {
        const status = 'removed';
        return { name, status, oldValue };
      }

      const status = 'added';
      return { name, status, newValue };
    });

    return ast;
  };

  const children = iter(data1, data2);
  return { children };
};

const readAndParse = (filepath) => {
  const data = fs.readFileSync(filepath, 'utf-8');
  const extension = path.extname(filepath);
  const parse = parsers[extension];
  return parse(data);
};

const genDiff = (first, second, format = defaultFormat) => {
  if (!formats.includes(format)) {
    throw new Error('Unknown format');
  }

  const data1 = readAndParse(first);
  const data2 = readAndParse(second);

  const tree = makeTree(data1, data2);
  const result = render(tree, format);
  return result;
};

export default genDiff;

const b = '/Users/igor/Documents/Dev/Hexlet/project2/__tests__/__fixtures__/before.ini';
const a = '/Users/igor/Documents/Dev/Hexlet/project2/__tests__/__fixtures__/after.ini';

console.log(genDiff(b, a, 'json'));
