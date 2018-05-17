import _ from 'lodash';
import read from './read';

const statuses = {
  same: 1, changed: 2, added: 3, deleted: 4, nested: 5,
};

const makeTree = (data1, data2) => {
  const makeTemplate = () => ({
    name: '',
    status: '',
    children: [],
    left: undefined,
    right: undefined,
  });

  const saveValue = value => (value instanceof Object ? Object.assign({}, value) : value);

  const iter = (obj1, obj2) => {
    const keys = _.union(Object.keys(obj1), Object.keys(obj2));

    const ast = keys.reduce((acc, key) => {
      const value1 = obj1[key];
      const value2 = obj2[key];

      const node = makeTemplate();
      node.name = key;

      if (_.has(obj1, key) && _.has(obj2, key)) {
        if (value1 instanceof Object && value2 instanceof Object) {
          node.status = statuses.nested;
          node.children = iter(value1, value2);
        } else if (value1 === value2) {
          node.status = statuses.same;
          node.left = value1;
        } else {
          node.status = statuses.changed;
          node.left = saveValue(value1);
          node.right = saveValue(value2);
        }
      } else if (_.has(obj1, key)) {
        node.status = statuses.deleted;
        node.left = saveValue(value1);
      } else {
        node.status = statuses.added;
        node.right = saveValue(value2);
      }

      return [...acc, node];
    }, []);

    return ast;
  };

  const tree = makeTemplate();
  tree.status = statuses.nested;
  tree.children = iter(data1, data2);
  return tree;
};

const render = (tree) => {
  const makeTab = level => ' '.repeat(level < 0 ? 0 : level * 4);

  const format = (tabSize, prefix, name, value) => {
    const valueToString = (val, depth) => {
      if (val instanceof Object) {
        const keys = Object.keys(val);
        const res = keys.reduce((acc, key) => {
          const temp = valueToString(val[key], depth + 1);
          return [...acc, format(depth + 1, '', key, temp)];
        }, []);
        return ['{', ...res, `${makeTab(depth)}}`].join('\n');
      }

      return val;
    };

    const val = valueToString(value, tabSize + 1);
    const res = `${makeTab(tabSize)}${prefix}${name}: ${val}`;
    return res;
  };

  const stringify = (node, depth) => {
    const res = [];
    if (node.status === statuses.same) {
      res.push(format(depth, '    ', node.name, node.left));
    } else if (node.status === statuses.changed) {
      res.push(format(depth, '  - ', node.name, node.left));
      res.push(format(depth, '  + ', node.name, node.right));
    } else if (node.status === statuses.added) {
      res.push(format(depth, '  + ', node.name, node.right));
    } else if (node.status === statuses.deleted) {
      res.push(format(depth, '  - ', node.name, node.left));
    }
    return res;
  };

  const traversal = (node, depth) => {
    const res = [];
    if (node.status === statuses.nested) {
      const nested = node.children.reduce((acc, child) =>
        [...acc, ...traversal(child, depth + 1)], []);

      if (depth === -1) {
        res.push('{');
      } else {
        res.push(format(depth, '    ', node.name, '{'));
      }

      res.push(...nested);
      res.push(`${makeTab(depth + 1)}}`);
      return res;
    }

    return stringify(node, depth);
  };

  return traversal(tree, -1).join('\n');
};

const diff = (first, second) => {
  const data1 = read(first);
  const data2 = read(second);

  const tree = makeTree(data1, data2);
  const result = render(tree);
  return result;
};

export default diff;
