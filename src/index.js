import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import yaml from 'js-yaml';

const parsers = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
};

const parse = (filepath) => {
  const data = fs.readFileSync(filepath, 'utf-8');
  const extension = path.extname(filepath);
  const parser = parsers[extension];
  return parser(data);
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

  const intersections = _.intersection(keys1, keys2);

  const deleted = _.difference(keys1, keys2)
    .map(key => format.deleted(key, data1[key]));

  const added = _.difference(keys2, keys1)
    .map(key => format.added(key, data2[key]));

  const same = intersections
    .filter(key => data1[key] === data2[key])
    .map(key => format.same(key, data1[key]));

  const changed = intersections
    .filter(key => data1[key] !== data2[key])
    .map(key => format.changed(key, data2[key], data1[key]));

  const result = [...same, ...changed, ...added, ...deleted].join('\n');
  return `{\n${result}\n}`;
};

export default diff;
