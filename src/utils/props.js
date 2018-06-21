const traverse = require('@babel/traverse').default;
const { COMPONENT_TYPE } = require('../constants');
const {
  arePropsDestructuredInFunctionalComponentArguments,
  getFirstArgumentDestructuredAttributes,
  getFunctionalComponentDefinition,
  getFunctionalComponentPropVariableName,
  getVariableDestructuringPropertyNames,
  isClassDeclaration,
  isFunctionalComponentDeclaration,
  isObjectKeyAccessing,
  isPropertyDestructuring,
  isThisPropsDestructuring,
  isThisPropsKeyAccessing
} = require('./ast');
const lint = require('./lint');

const getProps = (code, ast) => {
  let componentType = null;
  let componentNodePath = null;

  traverse(ast, {
    enter(path) {
      const { node } = path;

      if (isClassDeclaration(node)) {
        componentNodePath = path;
        componentType = COMPONENT_TYPE.Class;
      }

      if (isFunctionalComponentDeclaration(node)) {
        componentNodePath = path;
        componentType = COMPONENT_TYPE.Functional;
      }
    }
  });

  const props = componentType === COMPONENT_TYPE.Class
    ? getClassComponentProps(componentNodePath)
    : getFunctionalComponentProps(componentNodePath);
  const uniqueProps = Array.from(new Set(props));
  return uniqueProps;
};

const getClassComponentProps = (classDeclarationNodePath) => {
  const props = [];

  classDeclarationNodePath.traverse({
    enter({ node }) {
      if (isThisPropsKeyAccessing(node)) {
        props.push(node.property.name);
      }

      if (isThisPropsDestructuring(node)) {
        props.push(...getVariableDestructuringPropertyNames(node));
      }
    }
  });

  return props;
};

const getFunctionalComponentProps = (functionalComponentNodePath) => {
  const componentNode = getFunctionalComponentDefinition(functionalComponentNodePath.node);
  const propsVariableName = getFunctionalComponentPropVariableName(componentNode);

  if (arePropsDestructuredInFunctionalComponentArguments(componentNode)) {
    return getFirstArgumentDestructuredAttributes(componentNode);
  }

  return getPropsFromPropsVariable(functionalComponentNodePath, propsVariableName);
};

const getPropsFromPropsVariable = (componentNodePath, propsVariableName) => {
  const props = [];

  componentNodePath.traverse({
    enter({ node }) {
      if (isObjectKeyAccessing(node, propsVariableName)) {
        props.push(node.property.name);
      }

      if (isPropertyDestructuring(node, propsVariableName)) {
        props.push(...getVariableDestructuringPropertyNames(node));
      }
    }
  });

  return props;
};

const getUnusedProps = (code) => {
  const rules = { 'react/prop-types': 2 };
  const linterMessages = lint(code, rules);
  const unusedProps = linterMessages
    .filter((linterError) => linterError.ruleId === 'react/prop-types')
    .map((linterError) => linterError.message.match(/\w+/)[0]);

  return unusedProps;
};

const isCallbackProp = (name, prefix = 'on') => {
  if (!name.startsWith(prefix) || name === prefix) {
    return false;
  }

  return name[prefix.length].toUpperCase() === name[prefix.length];
};

const getPropType = (name) => {
  if (name === 'className') {
    return 'PropTypes.string';
  }
  if (name === 'children') {
    return 'PropTypes.node';
  }
  if (isCallbackProp(name)) {
    return 'PropTypes.func';
  }
  return 'PropTypes.any';
};

module.exports = {
  getClassComponentProps,
  getFunctionalComponentProps,
  getProps,
  getPropsFromPropsVariable,
  getPropType,
  getUnusedProps
};
