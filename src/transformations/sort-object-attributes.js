const { isSingleLine } = require('../utils/ast');
const { generateIndent } = require('../utils');

const sortObjectAttributes = (code, indentSize, node) => {
  const innerIndent = generateIndent(indentSize + 2);
  const isMultiLine = !isSingleLine(node);
  let newCode = '{';
  newCode += isMultiLine ? '\n' : ' ';

  const sortedProperties = node.properties.map((property) => ({
    ...property,
    name: getName(code, property)
  })).sort(
    (a, b) => a.name.localeCompare(b.name)
  );

  sortedProperties.forEach((property, index) => {
    if (isMultiLine) {
      newCode += innerIndent;
    }
    if (property.computed) {
      newCode += '[';
    }
    newCode += code.substring(property.key.start, property.key.end);
    if (property.computed) {
      newCode += ']';
    }
    if (!property.shorthand) {
      newCode += ': ';
      newCode += code.substring(property.value.start, property.value.end);
    }
    if (index < sortedProperties.length - 1) {
      newCode += ',';
      if (isMultiLine) {
        newCode += '\n';
      } else {
        newCode += ' ';
      }
    }
  });

  newCode += isMultiLine ? `\n${generateIndent(indentSize)}` : ' ';
  newCode += '}';
  return newCode;
};

const getName = (code, { key }) => {
  if (key.name) {
    return key.name;
  }
  if (key.value) {
    return String(key.value);
  }

  return code.substring(key.start, key.end);
};

module.exports = sortObjectAttributes;
