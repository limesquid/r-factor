const {
  callExpression,
  exportDefaultDeclaration,
  exportNamedDeclaration,
  identifier,
  isBlockStatement,
  isProgram,
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
  const { componentExportPath, isInstantExport, isDefaultExport, originalComponentName } = details;
  const componentScope = getComponentScope(details);
  const newComponentName = getNewComponentName(details, componentScope);

  if (!originalComponentName || (isInstantExport && isDefaultExport)) {
    removeExportAndSetComponentName(source, details, newComponentName);
  }

  // if (isInstantExport && isDefaultExport) {
  //   removeExportAndSetComponentName(source, details, newComponentName);
  // }

  if (isInstantExport && !isDefaultExport) {
    removeExport(details);
    componentScope.rename(originalComponentName, newComponentName);
  }

  const wrappedComponentAst = createComponentWrappersAst(ast, details, newComponentName, { invoke, name, outermost });
  const exportAst = createExportAst(details, wrappedComponentAst);
  let codeWithoutImports;

  if (!isInstantExport) {
    componentExportPath.replaceWith(exportAst);
  } else {
    const componentScopeBodyNode = findComponentScopePath(details);

    // This is a hack. We need to append exportAst to body, but there is no empty line before it.
    const exportAstWithEmptyLine = parser.parse('\n\n' + parser.print(exportAst)).program.body[0];
    appendNode(componentScopeBodyNode, exportAstWithEmptyLine);
  }

  const codeWithComponentWrapped = parser.print(ast);

  return importDetails
    ? addImportDeclaration(codeWithComponentWrapped, ast, importDetails)
    : codeWithComponentWrapped;
};

const findComponentScopePath = ({ functionalComponentPath, classComponentPath, componentExportPath }) => {
  const componentPath = functionalComponentPath || classComponentPath || componentExportPath;
  return componentPath.findParent(
    ({ node }) => isBlockStatement(node) || isProgram(node)
  ).node;
};

const appendNode = (componentScopePath, node) => {
  componentScopePath.body.push(node);
}

const getComponentScope = ({ classComponentPath, functionalComponentPath }) =>
  (classComponentPath || functionalComponentPath).scope;

const getNewComponentName = (details, componentScope) => {
  const { componentNameCollisionPattern, defaultComponentName } = settings;
  const { isDefaultExport, isInstantExport, originalComponentName, exportedComponentName } = details;
  const findNameFromPotential = (names) => names
    .filter(Boolean)
    .find((potentialName) => !componentScope.hasBinding(potentialName));

  if (isDefaultExport && isInstantExport) {
    return findNameFromPotential([
      defaultComponentName,
      componentNameCollisionPattern.replace('${name}', defaultComponentName)
    ]);
  }

  if (isDefaultExport && !isInstantExport) {
    return originalComponentName;
  }

  console.log(exportedComponentName, originalComponentName);
  if (exportedComponentName !== originalComponentName) {
    return originalComponentName;
  }

  if (!details.closestHoCPath) {
    return findNameFromPotential([
      componentNameCollisionPattern.replace('${name}', originalComponentName),
      defaultComponentName,
      componentNameCollisionPattern.replace('${name}', defaultComponentName),
      componentScope.generateUidIdentifier(originalComponentName || defaultComponentName)
    ]);
  }

  return originalComponentName;
};

const createExportAst = (details, wrappedComponentAst) => {
  if (details.isDefaultExport) {
    return exportDefaultDeclaration(wrappedComponentAst);
  }

  return exportNamedDeclaration(
    variableDeclaration(
      'const', [
        variableDeclarator(
            identifier(details.exportedComponentName),
          wrappedComponentAst
        )
      ]
    ),
    []
  );
}

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

const createComponentWrappersAst = (ast, details, newComponentName, { invoke, name, outermost }) => {
  const { closestHoCPath, componentIdentifierInHoC } = details;
  const isAlreadyWrapped = Boolean(closestHoCPath);

  if (outermost && isAlreadyWrapped) {
    return buildWraperAst(name, invoke, getOutermostCallExpressionPath(closestHoCPath).node);
  }

  if (!outermost && isAlreadyWrapped) {
    closestHoCPath.node.arguments = closestHoCPath.node.arguments.map(
      (argument) => argument === componentIdentifierInHoC
        ? buildWraperAst(name, invoke, componentIdentifierInHoC)
        : argument
    );
    return getOutermostCallExpressionPath(closestHoCPath).node; 
  }

  return buildWraperAst(name, invoke, identifier(newComponentName));
};

module.exports = wrapComponent;
