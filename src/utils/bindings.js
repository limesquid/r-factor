const findBinding = (scope, name) => {
  const binding = scope.bindings[name];

  if (binding) {
    return binding;
  }

  if (scope.parent) {
    return findBinding(scope.parent, name);
  }

  return null;
};


module.exports = {
  findBinding
};
