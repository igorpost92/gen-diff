import fs from 'fs';
import _ from 'lodash';

const parse = (filepath) => {
  const encoding = 'utf-8';
  const data = fs.readFileSync(filepath, encoding);
  const json = JSON.parse(data);
  return json;
};

const format = {
  added: (key, value) => `  + ${key}: ${value}`,
  deleted: (key, value) => `  - ${key}: ${value}`,
  same: (key, value) => `    ${key}: ${value}`,
  changed: (key, newValue, old) => `${format.added(key, newValue)}\n${format.deleted(key, old)}`,
};

const diff = (first, second) => {
  const json1 = parse(first);
  const json2 = parse(second);

  const keys1 = Object.keys(json1);
  const keys2 = Object.keys(json2);

  const intersections = _.intersection(keys1, keys2);

  const deleted = _.difference(keys1, keys2)
    .map(key => format.deleted(key, json1[key]));

  const added = _.difference(keys2, keys1)
    .map(key => format.added(key, json2[key]));

  const same = intersections
    .filter(key => json1[key] === json2[key])
    .map(key => format.same(key, json1[key]));

  const changed = intersections
    .filter(key => json1[key] !== json2[key])
    .map(key => format.changed(key, json2[key], json1[key]));

  const result = [...same, ...changed, ...added, ...deleted].join('\n');
  return `{\n${result}\n}`;
};

export default diff;
