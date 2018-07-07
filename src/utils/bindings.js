const findBinding = (scope, name) => {
  const binding = scope.bindings[name];

  if (binding) {
    return binding;
  }

  // Not sure whether it is needed. Possibly each scope has bindings of parent scopes. Needs to be checked.
  if (scope.parent) {
    return findBinding(scope.parent, name);
  }

  return null;
};

const removeBinding = (scope, name) => {
  const binding = findBinding(scope, name);
  if (binding) {
    binding.path.remove();
  }
};

module.exports = {
  findBinding,
  removeBinding
};
