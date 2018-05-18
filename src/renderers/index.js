import structured from './structured';
import plain from './plain';

const statuses = ({
  structured,
  plain,
});

const render = (tree, format) => statuses[format].nested(tree);

export default render;
