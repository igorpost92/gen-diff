const makeTab = level => ' '.repeat(level < 0 ? 0 : level * 4);

const stringify = (tabSize, name, value, prefix = '') => {
  const indent = prefix ? `${makeTab(tabSize - 1)}  ${prefix} ` : makeTab(tabSize);

  if (!(value instanceof Object)) {
    return `${indent}${name}: ${value}`;
  }

  const keys = Object.keys(value);
  const nested = keys.map(key => stringify(tabSize + 1, key, value[key]));

  const res = [`${indent}${name}: {`, ...nested, `${makeTab(tabSize)}}`];
  return res.join('\n');
};

const statuses = {
  same: ({ name, oldValue }, depth) => stringify(depth, name, oldValue),
  removed: ({ name, oldValue }, depth) => stringify(depth, name, oldValue, '-'),
  added: ({ name, newValue }, depth) => stringify(depth, name, newValue, '+'),
  updated: (node, depth) => [statuses.removed(node, depth), statuses.added(node, depth)].join('\n'),
  nested: ({ name, children }, depth) => {
    const nested = children.reduce((acc, child) =>
      [...acc, statuses[child.status](child, depth + 1)], []);

    const start = depth === 0 ? '{' : stringify(depth, name, '{');
    const res = [start, ...nested, `${makeTab(depth)}}`];
    return res.join('\n');
  },
};

const render = tree => statuses.nested(tree, 0);

export default render;
