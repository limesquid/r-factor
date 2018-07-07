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
const settings = require('../../settings');
const { getOutermostCallExpressionPath } = require('../../utils/ast');

const findComponentScopePath = ({ arrowComponentDeclaration, classComponentPath, componentExportPath }) => {
  const componentPath = arrowComponentDeclaration || classComponentPath || componentExportPath;
  return componentPath.findParent(
    ({ node }) => isBlockStatement(node) || isProgram(node)
  ).node;
};

const appendNode = (componentScopePath, node) => {
  componentScopePath.body.push(node);
};

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
};

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

  const componentDefinitionCode = source.slice(componentDeclaration.start, componentDeclaration.end);
  const componentCode = `const ${newComponentName} = ${componentDefinitionCode}`;
  const newComponentDeclaration = parser.parse(componentCode).program.body[0];
  componentExportPath.replaceWith(newComponentDeclaration);
};

const createBodylessArrowFunctionBlock = (newComponentName, wrappedComponentAst, details) => {
  const { arrowComponentExpressionPath } = details;
  const componentDefinitionCode = parser.print(arrowComponentExpressionPath.node);
  const arrowComponentAst = parser.parse(
    `const ${newComponentName} = ${componentDefinitionCode}${settings.semicolon}${settings.doubleEndOfLine}`
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

module.exports = {
  findComponentScopePath,
  appendNode,
  getNewComponentName,
  createExportAst,
  removeExport,
  removeExportAndSetComponentName,
  createBodylessArrowFunctionBlock,
  createComponentWrappersAst
};
