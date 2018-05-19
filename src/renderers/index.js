import structured from './structured';
import plain from './plain';
import json from './json';

const stringify = ({
  structured,
  plain,
  json,
});

export const formats = Object.keys(stringify);

const render = (tree, format) => stringify[format](tree);

export default render;
