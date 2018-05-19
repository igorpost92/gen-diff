import fs from 'fs';
import path from 'path';

import getParser from './parsers';
import makeTree from './astBuilder';
import getRenderer from './renderers';

export const defaultFormat = 'structured';

const readAndParse = (filepath) => {
  const data = fs.readFileSync(filepath, 'utf-8');
  const ext = path.extname(filepath);
  const parse = getParser(ext);
  return parse(data);
};

const genDiff = (first, second, format = defaultFormat) => {
  const render = getRenderer(format);
  if (!render) {
    throw new Error('Unknown format');
  }

  const data1 = readAndParse(first);
  const data2 = readAndParse(second);

  const tree = makeTree(data1, data2);
  const result = render(tree);
  return result;
};

export default genDiff;
