const template = require('babel-template');
const {
  blockStatement,
  callExpression,
  exportDefaultDeclaration,
  exportNamedDeclaration,
  identifier,
  isBlockStatement,
  isProgram,
  returnStatement,
  variableDeclaration,
  variableDeclarator
} = require('@babel/types');
const parser = require('../../utils/parser');
const addImportDeclaration = require('../add-import-declaration');
const ComponentExportDetails = require('../../utils/component-export-details');
const { getOutermostCallExpressionPath } = require('../../utils/ast');
const settings = require('../../settings');

const wrapComponent = (source, ast = parser.parse(source),  options) => {
  const { import: importDetails, invoke, name, outermost = false } = options;
  const details = new ComponentExportDetails(ast).getDetails();
  const {
    arrowComponentDeclaration,
    arrowComponentExpressionPath,
    componentExportPath,
    componentReturnPath,
    isDefaultExport,
    isHoc,
    isInstantExport,
    originalComponentName
  } = details;
  const componentScope = getComponentScope(details);
  const newComponentName = getNewComponentName(details, componentScope);

  if (!isHoc && (!originalComponentName || (isInstantExport && isDefaultExport))) {
    removeExportAndSetComponentName(source, details, newComponentName);
  }

  if (isInstantExport && !isDefaultExport) {
    removeExport(details);
    componentScope.rename(originalComponentName, newComponentName);
  }

  const wrappedComponentAst = createComponentWrappersAst(ast, details, identifier(newComponentName), { invoke, name, outermost });

  if (!isHoc && !isInstantExport) {
    const exportAst = createExportAst(details, wrappedComponentAst);
    componentExportPath.replaceWith(exportAst);
  }

  if (!isHoc && isInstantExport) {
    const exportAst = createExportAst(details, wrappedComponentAst);
    const componentScopeBodyNode = findComponentScopePath(details);

    // This is a hack. We need to append exportAst to body, but there is no empty line before it.
    const exportAstWithEmptyLine = parser.parse(`${settings.doubleEndOfLine}${parser.print(exportAst)}`).program.body[0];
    appendNode(componentScopeBodyNode, exportAstWithEmptyLine);
  }

  if (isHoc && componentReturnPath) {
    const returnAst = returnStatement(wrappedComponentAst);
    const componentScopeBodyNode = findComponentScopePath(details);
    componentReturnPath.replaceWith(returnAst);
  }

  if (isHoc && !componentReturnPath) {
    const blockAst = createBodylessArrowFunctionBlock(newComponentName, wrappedComponentAst, details);
    arrowComponentExpressionPath.replaceWith(blockAst);
  }

  const codeWithComponentWrapped = parser.print(ast);

  return importDetails
    ? addImportDeclaration(codeWithComponentWrapped, ast, importDetails)
    : codeWithComponentWrapped;
};

const findComponentScopePath = ({ arrowComponentDeclaration, classComponentPath, componentExportPath }) => {
  const componentPath = arrowComponentDeclaration || classComponentPath || componentExportPath;
  return componentPath.findParent(
    ({ node }) => isBlockStatement(node) || isProgram(node)
  ).node;
};

const appendNode = (componentScopePath, node) => {
  componentScopePath.body.push(node);
}

const getComponentScope = ({ classComponentPath, arrowComponentDeclaration, arrowComponentExpressionPath }) =>
  (classComponentPath || arrowComponentDeclaration || arrowComponentExpressionPath).scope;

const getNewComponentName = (details, componentScope) => {
  const { componentNameCollisionPattern, defaultComponentName, defaultHocComponentName } = settings;
  const {
    componentReturnPath,
    isDefaultExport,
    isHoc,
    isInstantExport,
    originalComponentName,
    exportedComponentName
  } = details;
  const findNameFromPotential = (names) => names
    .filter(Boolean)
    .find((potentialName) => !componentScope.hasBinding(potentialName));

  if (isHoc && !componentReturnPath) {
    return findNameFromPotential([
      defaultHocComponentName,
      componentNameCollisionPattern.replace('${name}', defaultHocComponentName),
      componentScope.generateUidIdentifier(defaultHocComponentName)
    ]);
  }

  if (isHoc && originalComponentName) {
    return originalComponentName;
  }

  if (isDefaultExport && isInstantExport) {
    return findNameFromPotential([
      defaultComponentName,
      componentNameCollisionPattern.replace('${name}', defaultComponentName)
    ]);
  }

  if (isDefaultExport && !isInstantExport) {
    return originalComponentName;
  }

  if (exportedComponentName && exportedComponentName !== originalComponentName) {
    return originalComponentName;
  }

  const preferableComponentName = originalComponentName || defaultComponentName;
  return findNameFromPotential([
    componentNameCollisionPattern.replace('${name}', preferableComponentName),
    defaultComponentName,
    componentNameCollisionPattern.replace('${name}', defaultComponentName),
    componentScope.generateUidIdentifier(originalComponentName || defaultComponentName)
  ]);
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

const removeExport = ({ componentExportPath, arrowComponentDeclaration, classComponentPath }) =>
  componentExportPath.replaceWith(arrowComponentDeclaration || classComponentPath);

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

const createBodylessArrowFunctionBlock = (newComponentName, wrappedComponentAst, details) => {
  const { arrowComponentExpressionPath } = details;
  const arrowComponentAst = parser.parse(
    `const ${newComponentName} = ${parser.print(arrowComponentExpressionPath.node)}${settings.semicolon}${settings.doubleEndOfLine}`
  ).program.body[0];
  return blockStatement([ arrowComponentAst, returnStatement(wrappedComponentAst) ]);
};

const buildWrapperAst = (name, invoke, componentIdentifier) => {
  let callee = identifier(name);

  if (invoke) {
    callee = callExpression(
      identifier(name),
      invoke.map((argument) => typeof argument === 'string' ? identifier(argument) : argument)
    );
  }

  return callExpression(callee, [ componentIdentifier ]);
};

const createComponentWrappersAst = (ast, details, nodeToWrap, { invoke, name, outermost }) => {
  const { closestHocPath, componentIdentifierInHoc } = details;
  const isAlreadyWrapped = Boolean(closestHocPath);

  if (outermost && isAlreadyWrapped) {
    return buildWrapperAst(name, invoke, getOutermostCallExpressionPath(closestHocPath).node);
  }

  if (!outermost && isAlreadyWrapped) {
    closestHocPath.node.arguments = closestHocPath.node.arguments.map(
      (argument) => argument === componentIdentifierInHoc
        ? buildWrapperAst(name, invoke, componentIdentifierInHoc)
        : argument
    );
    return getOutermostCallExpressionPath(closestHocPath).node; 
  }

  return buildWrapperAst(name, invoke, nodeToWrap);
};

module.exports = wrapComponent;
