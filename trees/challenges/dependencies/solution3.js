export default (deps) => {
  const iter = (name, acc) => {
    if (acc.includes(name)) {
      return acc;
    }

    const children = deps[name] || [];
    return [...children.reduce((initAcc, name) => iter(name, initAcc), acc) , name];
  };

  return Object.keys(deps)
    .reduce((acc, name) => iter(name, acc), []);
};