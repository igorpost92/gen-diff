import { flatten } from 'lodash';

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

const types = {
  unchanged: ({ name, oldValue }, depth) => stringify(depth, name, oldValue),
  removed: ({ name, oldValue }, depth) => stringify(depth, name, oldValue, '-'),
  added: ({ name, newValue }, depth) => stringify(depth, name, newValue, '+'),
  updated: (node, depth) => [types.removed(node, depth), types.added(node, depth)],
  nested: ({ name, children }, depth, traverse) => {
    const nested = traverse(children, depth + 1);
    const indent = makeTab(depth);
    const res = `${indent}${name}: {\n${nested}\n${indent}}`;
    return res;
  },
};

const render = (children, depth = 1) => {
  const temp = children.map((child) => {
    const value = types[child.type](child, depth, render);
    return value;
  });
  const res = flatten(temp);
  return res.join('\n');
};

export default tree => `{\n${render(tree.children)}\n}`;
