import _ from 'lodash';
import fs from 'fs';
import path from 'path';

import parsers from './parsers';
import render, { formats, defaultFormat } from './renderers';

const makeTree = (data1, data2) => {
  const iter = (obj1, obj2) => {
    const keys = _.union(Object.keys(obj1), Object.keys(obj2));

    const ast = keys.map((key) => {
      const oldValue = obj1[key];
      const newValue = obj2[key];

      const template = { name: key };

      if (_.has(obj1, key) && _.has(obj2, key)) {
        if (oldValue instanceof Object && newValue instanceof Object) {
          const children = iter(oldValue, newValue);
          const status = 'nested';
          return { ...template, status, children };
        } else if (oldValue === newValue) {
          const status = 'same';
          return { ...template, status, oldValue };
        }

        const status = 'updated';
        return {
          ...template, status, oldValue, newValue,
        };
      } else if (_.has(obj1, key)) {
        const status = 'removed';
        return { ...template, status, oldValue };
      }

      const status = 'added';
      return { ...template, status, newValue };
    });

    return ast;
  };

  const children = iter(data1, data2);
  return { status: 'nested', children };
};

const genDiff = (first, second, format = defaultFormat) => {
  const readAndParse = (filepath) => {
    const data = fs.readFileSync(filepath, 'utf-8');
    const extension = path.extname(filepath);
    const parse = parsers[extension];
    return parse(data);
  };

  if (!formats.includes(format)) {
    console.log(`Unknown format. Available formats: ${formats.join(', ')}`);
    process.exit(1);
  }

  const data1 = readAndParse(first);
  const data2 = readAndParse(second);

  const tree = makeTree(data1, data2);
  const result = render(tree, format);
  return result;
};

export default genDiff;

// const b = '/Users/igor/Documents/Dev/Hexlet/project2/__tests__/__fixtures__/before.ini';
// const a = '/Users/igor/Documents/Dev/Hexlet/project2/__tests__/__fixtures__/after.ini';

// console.log(genDiff(b, a));
