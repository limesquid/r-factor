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

module.exports = {
  getProps,
  getClassComponentProps,
  getFunctionalComponentProps,
  getPropsFromPropsVariable
};
