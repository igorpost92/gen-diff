import structured from './structured';
import plain from './plain';
import json from './json';

const renderers = ({
  structured,
  plain,
  json,
});

const getRenderer = format => renderers[format];

export default getRenderer;
