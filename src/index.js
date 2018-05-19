import fs from 'fs';
import path from 'path';

import parsers from './parsers';
import makeTree from './astBuilder';
import render, { formats } from './renderers';

export const defaultFormat = formats[0];

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
