import structured from './structured';
import plain from './plain';

const stringify = ({
  structured,
  plain,
});

const render = (tree, format) => stringify[format](tree);

export default render;
