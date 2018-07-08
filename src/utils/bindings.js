const findBinding = (scope, name) => {
  const binding = scope.bindings[name];
  return binding || null;
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
