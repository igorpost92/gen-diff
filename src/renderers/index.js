import statuses from '../statuses';

const makeTab = level => ' '.repeat(level < 0 ? 0 : level * 4);

const format = (tabSize, prefix, name, value) => {
  const valueToString = (val, depth) => {
    if (val instanceof Object) {
      const keys = Object.keys(val);
      const res = keys.map(key => format(depth + 1, '', key, valueToString(val[key], depth + 1), []));
      return ['{', ...res, `${makeTab(depth)}}`].join('\n');
    }

    return val;
  };

  const val = valueToString(value, tabSize + 1);
  const res = `${makeTab(tabSize)}${prefix}${name}: ${val}`;
  return res;
};

const stringify = (node, depth) => {
  if (node.status === statuses.same) {
    return format(depth + 1, '', node.name, node.oldValue);
  } else if (node.status === statuses.changed) {
    return `${format(depth, '  - ', node.name, node.oldValue)}\n${format(depth, '  + ', node.name, node.newValue)}`;
  } else if (node.status === statuses.added) {
    return format(depth, '  + ', node.name, node.newValue);
  }
  return format(depth, '  - ', node.name, node.oldValue);
};

const traversal = (node, depth) => {
  if (node.status === statuses.nested) {
    const nested = node.children.reduce((acc, child) =>
      [...acc, ...traversal(child, depth + 1)], []);

    const start = depth === -1 ? '{' : format(depth + 1, '', node.name, '{');
    return [start, ...nested, `${makeTab(depth + 1)}}`];
  }

  return [stringify(node, depth)];
};

const render = tree => traversal(tree, -1).join('\n');

export default render;
