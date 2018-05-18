import structured from './structured';
import plain from './plain';

export const formats = ['structured', 'plain'];
export const defaultFormat = formats[0];

const stringify = ({
  structured,
  plain,
});

const render = (tree, format) => stringify[format](tree);

export default render;
