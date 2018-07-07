const { identifier, returnStatement } = require('@babel/types');
const parser = require('../../utils/parser');
const addImportDeclaration = require('../add-import-declaration');
const ComponentExportDetails = require('../../utils/component-export-details');
const settings = require('../../settings');
const {
  findComponentScopePath,
  appendNode,
  getNewComponentName,
  createExportAst,
  removeExport,
  removeExportAndSetComponentName,
  createBodylessArrowFunctionBlock,
  createComponentWrappersAst
} = require('./utils');

/* eslint-disable max-statements */
const wrapComponent = (source, ast = parser.parse(source), options) => {
  const { import: importDetails, invoke, name, outermost = false } = options;
  const details = new ComponentExportDetails(ast).getDetails();
  const {
    arrowComponentExpressionPath,
    componentExportPath,
    componentReturnPath,
    componentScope,
    isDefaultExport,
    isHoc,
    isInstantExport,
    originalComponentName
  } = details;
  const newComponentName = getNewComponentName(details, componentScope);

  if (!isHoc && (!originalComponentName || (isInstantExport && isDefaultExport))) {
    removeExportAndSetComponentName(source, details, newComponentName);
  }

  if (!isHoc && isInstantExport && !isDefaultExport) {
    removeExport(details);
    componentScope.rename(originalComponentName, newComponentName);
  }

  const wrappedComponentAst = createComponentWrappersAst(
    ast,
    details,
    identifier(newComponentName),
    { invoke, name, outermost }
  );

  if (!isHoc && !isInstantExport) {
    const exportAst = createExportAst(details, wrappedComponentAst);
    componentExportPath.replaceWith(exportAst);
  }

  if (!isHoc && isInstantExport) {
    const exportAst = createExportAst(details, wrappedComponentAst);
    const componentScopeBodyNode = findComponentScopePath(details);

    // This is a hack. We need to append exportAst to body, but there is no empty line before it.
    const exportAstWithEmptyLine = parser.parse(
      `${settings.doubleEndOfLine}${parser.print(exportAst)}`
    ).program.body[0];
    appendNode(componentScopeBodyNode, exportAstWithEmptyLine);
  }

  if (isHoc && componentReturnPath) {
    const returnAst = returnStatement(wrappedComponentAst);
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
/* eslint-enable max-statements */

module.exports = wrapComponent;
