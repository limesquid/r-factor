const settings = require('../settings');
const { getNodeIndent } = require('../utils/ast');
const { squeezeCode } = require('../utils');

const insertCodeBelowNode = (code, node, codeToInsert) => {
  const indent = getNodeIndent(node);
  const indentedCodeToInsert = squeezeCode(codeToInsert, indent);
  const position = code.indexOf(settings.endOfLine, node.end) + settings.endOfLine.length;

  let newCode = '';
  newCode += code.slice(0, position);
  newCode += indentedCodeToInsert;
  newCode += code.slice(position);

  return newCode;
};

module.exports = insertCodeBelowNode;
