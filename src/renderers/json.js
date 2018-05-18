const render = (tree) => {
  const t = JSON.stringify(tree.children, null, '  ');
  return t;
};

export default render;
