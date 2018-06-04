const addImportDeclaration = require('./add-import-declaration');
const addPropsUsage = require('./add-props-usage');
const addPropTypes = require('./add-prop-types');
const insertCodeBelowNode = require('./insert-code-below-node');
const sortImports = require('./sort-imports');
const sortObjectAttributes = require('./sort-object-attributes');

module.exports = {
  addImportDeclaration,
  addPropsUsage,
  addPropTypes,
  insertCodeBelowNode,
  sortImports,
  sortObjectAttributes
};
