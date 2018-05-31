const { getNodeIndent } = require('../utils/ast');
const { squeezeCode } = require('../utils');

const insertCodeBelowNode = (source, node, codeToInsert) => {
  const indent = getNodeIndent(node);
  const indentedCodeToInsert = squeezeCode(codeToInsert, indent);
  const position = source.indexOf('\n', node.end) + 1;

  let code = '';
  code += source.slice(0, position);
  code += indentedCodeToInsert;
  code += source.slice(position);

  return code;
};

module.exports = insertCodeBelowNode;
