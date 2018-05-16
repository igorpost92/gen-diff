import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';

const parsers = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
};

const parse = (filepath) => {
  const data = fs.readFileSync(filepath, 'utf-8');
  const extension = path.extname(filepath);
  const perform = parsers[extension];
  return perform(data);
};

const format = {
  added: (key, value) => `  + ${key}: ${value}`,
  deleted: (key, value) => `  - ${key}: ${value}`,
  same: (key, value) => `    ${key}: ${value}`,
  changed: (key, newValue, old) => `${format.added(key, newValue)}\n${format.deleted(key, old)}`,
};

const diff = (first, second) => {
  const data1 = parse(first);
  const data2 = parse(second);

  const keys1 = Object.keys(data1);
  const keys2 = Object.keys(data2);

  const keys = _.union(keys1, keys2).map((key) => {
    const value1 = data1[key];
    const value2 = data2[key];

    if (_.has(data1, key) && _.has(data2, key)) {
      if (value1 === value2) {
        return format.same(key, value1);
      }
      return format.changed(key, value2, value1);
    } else if (_.has(data1, key)) {
      return format.deleted(key, value1);
    }
    return format.added(key, value2);
  });

  const result = keys.join('\n');
  return `{\n${result}\n}`;
};

export default diff;
