const babylon = require('babylon');
const traverse = require('@babel/traverse').default;
const { babylonOptions } = require('../options');
const {
  arePropsDestructuredInFunctionalComponentArguments,
  getClassComponentName,
  getFirstArgumentDestructuredAttributes,
  getFunctionalComponentDefinition,
  getFunctionalComponentName,
  getFunctionalComponentPropVariableName,
  getVariableDestructuringPropertyNames,
  isClassDeclaration,
  isFunctionalComponentDeclaration,
  isObjectKeyAccessing,
  isPropertyDestructuring,
  isPropTypesDeclaration,
  isThisPropsDestructuring,
  isThisPropsKeyAccessing,
  isStaticPropTypesDeclaration
} = require('../node-utils');
const { COMPONENT_TYPE } = require('../constants');
const { AbstractRefactoring } = require('../model');
const ClassBuilder = require('./class-builder');

class GeneratePropTypes extends AbstractRefactoring {
  constructor() {
    super();

    this.generatePropTypes = this.generatePropTypes.bind(this);
    this.getClassComponentProps = this.getClassComponentProps.bind(this);
    this.getFunctionalComponentProps = this.getFunctionalComponentProps.bind(this);
    this.getPropsFromPropsVariable = this.getPropsFromPropsVariable.bind(this);

    this.transformations = [
      this.generatePropTypes
    ];
  }

  canApply(code) {
    const ast = babylon.parse(code, babylonOptions);
    let isComponent = false;

    traverse(ast, {
      enter({ node }) {
        if (isClassDeclaration(node)) {
          isComponent = true;
        }

        if (isFunctionalComponentDeclaration(node)) {
          isComponent = true;
        }
      }
    });

    return isComponent;
  }

  generatePropTypes(code, ast) {
    let componentType = null;
    let componentName = null;
    let componentNodePath = null;
    const builder = new ClassBuilder(code);

    traverse(ast, {
      enter(path) {
        const { node } = path;

        if (isPropTypesDeclaration(node)) {
          builder.setPropTypesObjectNode(node.expression.right);
          builder.setPropTypesObjectNodePath(path.get('expression').get('right'));
        }

        if (isStaticPropTypesDeclaration(node)) {
          builder.setPropTypesObjectNode(node.value);
          builder.setPropTypesObjectNodePath(path.get('value'));
        }

        if (isClassDeclaration(node)) {
          builder.setComponentNode(node);
          componentName = getClassComponentName(node);
          componentNodePath = path;
          componentType = COMPONENT_TYPE.Class;
        }

        if (isFunctionalComponentDeclaration(node)) {
          builder.setComponentNode(node);
          componentName = getFunctionalComponentName(node);
          componentNodePath = path;
          componentType = COMPONENT_TYPE.Functional;
        }
      }
    });

    const props = componentType === COMPONENT_TYPE.Class
      ? this.getClassComponentProps(componentNodePath)
      : this.getFunctionalComponentProps(componentNodePath);
    const uniqueProps = Array.from(new Set(props));

    builder.setUsedProps(uniqueProps);
    builder.setComponentName(componentName);
    builder.setComponentType(componentType);

    return builder.build();
  }

  getClassComponentProps(classDeclarationNodePath) {
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
  }

  getFunctionalComponentProps(functionalComponentNodePath) {
    const componentNode = getFunctionalComponentDefinition(functionalComponentNodePath.node);
    const propsVariableName = getFunctionalComponentPropVariableName(componentNode);

    if (arePropsDestructuredInFunctionalComponentArguments(componentNode)) {
      return getFirstArgumentDestructuredAttributes(componentNode);
    }

    return this.getPropsFromPropsVariable(functionalComponentNodePath, propsVariableName);
  }

  getPropsFromPropsVariable(componentNodePath, propsVariableName) {
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
  }
}

module.exports = GeneratePropTypes;
