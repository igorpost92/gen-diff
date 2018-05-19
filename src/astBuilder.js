import _ from 'lodash';

const makeTree = (obj1, obj2) => {
  const keys = _.union(Object.keys(obj1), Object.keys(obj2));

  return keys.map((key) => {
    const oldValue = obj1[key];
    const newValue = obj2[key];

    const name = key;

    if (_.has(obj1, key) && _.has(obj2, key)) {
      if (oldValue instanceof Object && newValue instanceof Object) {
        const children = makeTree(oldValue, newValue);
        const status = 'nested';
        return { name, status, children };
      } else if (oldValue === newValue) {
        const status = 'same';
        return { name, status, oldValue };
      }

      const status = 'updated';
      return {
        name, status, oldValue, newValue,
      };
    } else if (_.has(obj1, key)) {
      const status = 'removed';
      return { name, status, oldValue };
    }

    const status = 'added';
    return { name, status, newValue };
  });
};

export default (data1, data2) => {
  const children = makeTree(data1, data2);
  return { children };
};
