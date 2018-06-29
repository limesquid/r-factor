const {
  callExpression,
  identifier,
  variableDeclaration,
  variableDeclarator
} = require('@babel/types');
const parser = require('../../utils/parser');
const addImportDeclaration = require('../add-import-declaration');
const getComponentExportDetails = require('../../utils/component-export-details');
const { getOutermostCallExpressionPath } = require('../../utils/ast');
const settings = require('../../settings');

const wrapComponent = (source, ast = parser.parse(source),  options) => {
  const { import: importDetails, invoke, name, outermost = false } = options;
  const details = getComponentExportDetails(ast);

  const { isInstantExport, isDefaultExport, originalComponentName } = details;
  const componentScope = getComponentScope(details);
  const newComponentName = getNewComponentName(details, componentScope);

  if (!originalComponentName) {
    removeExportAndSetComponentName(source, details, newComponentName);
  }

  if (isInstantExport && isDefaultExport) {
    renameComponent(componentScope, originalComponentName, newComponentName);
    removeExport(details);
  }

  if (isInstantExport && !isDefaultExport) {
    removeExport(details);
    componentScope.rename(originalComponentName, newComponentName);
  }

  wrapComponentInHoc(ast, details, { invoke, name, outermost });

  const codeWithoutImports = parser.print(ast);

  return addImportDeclaration(codeWithoutImports, ast, importDetails);
};

const getComponentScope = ({ classComponentPath, functionalComponentPath }) =>
  (classComponentPath || functionalComponentPath).scope;

const getNewComponentName = (details, componentScope) => {
  const { componentNameCollisionPattern, defaultComponentName, isDefaultExport } = settings;
  const { originalComponentName } = details;

  if (!details.closestHoCPath) {
    return [
      originalComponentName && componentNameCollisionPattern.replace('${name}', originalComponentName || defaultComponentName),
      defaultComponentName,
      componentScope.generateUidIdentifier(originalComponentName || defaultComponentName)
    ]
      .filter(Boolean)
      .find((potentialName) => !componentScope.hasBinding(potentialName));
  }

  return originalComponentName;
};

const removeExport = ({ componentExportPath, functionalComponentPath, classComponentPath }) =>
  componentExportPath.replaceWith(functionalComponentPath || classComponentPath);

const removeExportAndSetComponentName = (source, details, newComponentName) => {
  const { componentExportPath } = details;
  const componentDeclaration = componentExportPath.node.declaration;

  if (details.classComponentPath) {
    componentDeclaration.id = newComponentName;
    componentExportPath.replaceWith(componentDeclaration);
    return;
  }

  const componentCode = `const ${newComponentName} = ${source.slice(componentDeclaration.start, componentDeclaration.end)}`;
  const newComponentDeclaration = parser.parse(componentCode).program.body[0];
  componentExportPath.replaceWith(newComponentDeclaration);
};

const renameComponent = (details, originalComponentName, newComponentName) => {

};

const buildWraperAst = (name, invoke, componentIdentifier) => {
  let callee = identifier(name);

  if (invoke) {
    callee = callExpression(
      identifier(name),
      invoke.map((argument) => typeof argument === 'string' ? identifier(argument) : argument)
    );
  }

  return callExpression(callee, [ componentIdentifier ]);
};

const wrapComponentInHoc = (ast, details, { invoke, name, outermost }) => {
  const { closestHoCPath, componentIdentifierInHoC } = details;
  const isAlreadyWrapped = Boolean(closestHoCPath);

  if (isAlreadyWrapped) {
    if (!outermost) {
      closestHoCPath.node.arguments = closestHoCPath.node.arguments.map(
        (argument) => argument === componentIdentifierInHoC
          ? buildWraperAst(name, invoke, componentIdentifierInHoC)
          : argument
      );
    } else {
      const outerMostHoCPath = getOutermostCallExpressionPath(closestHoCPath);
      closestHoCPath.replaceWith(
        
      );
    }
  }
};

const refactorExport = (code, ast, details) => {
  const { componentNameCollisionPattern, defaultComponentName } = settings;
  const {
    classComponentPath,
    componentExportPath,
    functionalComponentPath,
    isDefaultExport,
    isInstantExport,
    originalComponentName
  } = details;

  const componentScope = (classComponentPath || functionalComponentPath).scope;
  const componentDeclaration = componentExportPath.node.declaration;
  let newComponentName = originalComponentName;

  if (!originalComponentName || !isDefaultExport) {
    newComponentName = [
      originalComponentName && componentNameCollisionPattern.replace('${name}', originalComponentName || defaultComponentName),
      defaultComponentName,
      componentScope.generateUidIdentifier(originalComponentName || defaultComponentName)
    ]
      .filter(Boolean)
      .find((potentialName) => !componentScope.hasBinding(potentialName));
  }


  if (!isInstantExport && isDefaultExport) {
    componentDeclaration.id = identifier(newComponentName);
  }

  if (originalComponentName) {
    componentScope.rename(originalComponentName, newComponentName);
  }

  if (!isInstantExport) {
    return;
  }

  if (functionalComponentPath) {
    const componentCode = `const ${newComponentName} = ${code.slice(componentDeclaration.start, componentDeclaration.end)}`;
    const newComponentDeclaration = parser.parse(componentCode).program.body[0];
    componentExportPath.replaceWith(newComponentDeclaration);
  } else {
    // classComponentPath.declaration.id = newComponentName;
    // classComponentPath.replaceWith(classComponentPath.declaration);
  }

  // if (originalComponentName) {
  //   // componentExportPath.replaceWith(
  //     // 
  //   // );
  // } else {
  //   const newComponentDeclaration = variableDeclaration('const', [
  //     variableDeclarator(identifier(newComponentName), componentDeclaration)
  //   ]);
  // }
};

module.exports = wrapComponent;
