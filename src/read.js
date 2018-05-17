import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const parsers = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
};

export default (filepath) => {
  const data = fs.readFileSync(filepath, 'utf-8');
  const extension = path.extname(filepath);
  const parse = parsers[extension];
  return parse(data);
};
