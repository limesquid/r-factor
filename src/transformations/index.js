const addImportDeclaration = require('./add-import-declaration');
const addPropsUsage = require('./add-props-usage');
const addPropTypes = require('./add-prop-types');
const addRootJsxProps = require('./add-root-jsx-props');
const insertCodeBelowNode = require('./insert-code-below-node');
const printObjectAttributes = require('./print-object-attributes');
const removeImportDeclaration = require('./remove-import-declaration');
const sortImports = require('./sort-imports');

module.exports = {
  addImportDeclaration,
  addPropsUsage,
  addPropTypes,
  addRootJsxProps,
  insertCodeBelowNode,
  printObjectAttributes,
  removeImportDeclaration,
  sortImports
};
