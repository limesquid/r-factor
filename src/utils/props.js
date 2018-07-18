const lint = require('./lint');

const getUnusedProps = (code) => {
  const rules = { 'react/prop-types': 2 };
  const linterMessages = lint(code, rules);
  const unusedProps = linterMessages
    .filter((linterError) => linterError.ruleId === 'react/prop-types')
    .map((linterError) => linterError.message.match(/\w+/)[0]);

  return unusedProps;
};

const getPropType = (name) => {
  if (name === 'children') {
    return 'PropTypes.node';
  }
  if (name === 'className') {
    return 'PropTypes.string';
  }
  if (name === 'disabled') {
    return 'PropTypes.bool';
  }
  if (name === 'style') {
    return 'PropTypes.object';
  }
  if (isPrefixedWith(name, 'on')) {
    return 'PropTypes.func';
  }
  if ([ 'is', 'has' ].some((prefix) => isPrefixedWith(name, prefix))) {
    return 'PropTypes.bool';
  }
  return 'PropTypes.any';
};

const isPrefixedWith = (name, prefix) => {
  if (!name.startsWith(prefix) || name === prefix) {
    return false;
  }

  return name[prefix.length].toUpperCase() === name[prefix.length];
};

module.exports = {
  getPropType,
  getUnusedProps
};
