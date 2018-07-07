const getComponentScope = (classComponentPath, arrowComponentDeclaration, arrowComponentExpressionPath) =>
  (classComponentPath || arrowComponentDeclaration || arrowComponentExpressionPath).scope;

module.exports = {
  getComponentScope
};
