const traverse = require('@babel/traverse').default;
const { isSpreadElement } = require('@babel/types');
const lint = require('./lint');
const parser = require('./parser');
const { isPropTypesDeclaration, isStaticPropTypesDeclaration } = require('./ast');

const getUnusedProps = (code) => {
  const rules = { 'react/prop-types': 2 };
  const linterMessages = lint(code, rules);
  const unusedProps = linterMessages
    .filter((linterError) => linterError.ruleId === 'react/prop-types')
    .map((linterError) => linterError.message.match(/\w+/)[0]);

  return unusedProps;
};

const getUnusedPropTypes = (code) => {
  const codeWithoutSpreadInPropTypes = getCodeWithoutSpreadInPropTypes(code);
  const unusedProps = getUnusedProps(codeWithoutSpreadInPropTypes);
  const newPropTypes = unusedProps.reduce((propTypes, prop) => ({
    ...propTypes,
    [prop]: getPropType(prop)
  }), {});
  return newPropTypes;
};

const getCodeWithoutSpreadInPropTypes = (code) => {
  const ast = parser.parse(code);
  let propTypesPath = null;

  traverse(ast, {
    enter(path) {
      if (isPropTypesDeclaration(path.node) || isStaticPropTypesDeclaration(path.node)) {
        propTypesPath = path;
        path.stop();
      }
    }
  });

  if (!propTypesPath) {
    return code;
  }

  propTypesPath.traverse({
    enter(path) {
      if (isSpreadElement(path.node)) {
        path.remove();
      }
    }
  });

  return parser.print(ast);
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
  getUnusedPropTypes,
  getUnusedProps
};
