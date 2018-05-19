const getFullName = (ancestry, name) => [...ancestry, name].join('.');

const valueToString = value => (value instanceof Object ? 'complex value' : `'${value}'`);

const stringify = (ancestry, name, valueString) => {
  const fullName = getFullName(ancestry, name);
  return `Property '${fullName}' ${valueString}`;
};

const types = {
  removed: ({ name, type }, ancestry) => {
    const valueString = `was ${type}`;
    return stringify(ancestry, name, valueString);
  },
  added: ({ name, type, newValue }, ancestry) => {
    const valueString = `was ${type} with value: ${valueToString(newValue)}`;
    return stringify(ancestry, name, valueString);
  },
  updated: (node, ancestry) => {
    const valueString = `was ${node.type}. From ${valueToString(node.oldValue)} to ${valueToString(node.newValue)}`;
    return stringify(ancestry, node.name, valueString);
  },
  nested: ({ name, children }, ancestry, traverse) => {
    const nested = traverse(children, [...ancestry, name]);
    return nested;
  },
};

const render = (children, ancestry = []) => {
  const res = children
    .filter(item => item.type !== 'unchanged')
    .reduce((acc, child) => [...acc, types[child.type](child, ancestry, render)], []);
  return res.join('\n');
};

export default tree => render(tree.children);
