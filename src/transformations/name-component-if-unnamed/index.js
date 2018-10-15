const ComponentExportDetails = require('../../utils/component-export-details');
const wrapComponent = require('../../transformations/wrap-component');
const unwrapComponent = require('../../transformations/unwrap-component');

const TEMPORARY_WRAPPER_NAME = 'temporaryWrapper';

const nameComponentIfUnnamed = (code, ast) => {
  const details = new ComponentExportDetails(ast).getDetails();
  const { arrowComponentDeclaration, arrowComponentExpressionPath, originalComponentName } = details;

  if (originalComponentName || (!arrowComponentDeclaration && !arrowComponentExpressionPath)) {
    return code;
  }

  const wrappedComponentCode = wrapComponent(code, ast, { name: TEMPORARY_WRAPPER_NAME });
  const unwrappedComponentCode = unwrapComponent(wrappedComponentCode, undefined, { name: TEMPORARY_WRAPPER_NAME });
  return unwrappedComponentCode;
};

module.exports = nameComponentIfUnnamed;
