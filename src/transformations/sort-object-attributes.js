const stable = require('stable');
const { isSingleLine } = require('../utils/ast');
const { generateIndent } = require('../utils');

const sortObjectAttributes = (code, indentSize, node) => {
  const innerIndent = generateIndent(indentSize + 2);
  const isMultiLine = !isSingleLine(node);
  const sortedProperties = sortProperties(code, node.properties);

  let newCode = '{';
  newCode += isMultiLine ? '\n' : ' ';
  sortedProperties.forEach((property, index) => {
    if (isMultiLine) {
      newCode += innerIndent;
    }
    if (property.computed) {
      newCode += '[';
    }
    if (property.type === 'RestElement') {
      newCode += code.substring(property.start, property.end);
    } else {
      newCode += code.substring(property.key.start, property.key.end);
    }
    if (property.computed) {
      newCode += ']';
    }
    if (property.value && !property.shorthand) {
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

const sortProperties = (code, properties) => {
  const propertiesWithNames = properties.map((property) => ({
    ...property,
    name: getName(code, property)
  }));
  return stable(
    stable(propertiesWithNames, propertyComparator),
    resetElementComparator
  );
};

const propertyComparator = (a, b) => {
  if (a.name.startsWith('on') && !b.name.startsWith('on')) {
    return 1;
  }
  if (!a.name.startsWith('on') && b.name.startsWith('on')) {
    return -1;
  }
  return a.name.localeCompare(b.name);
};

const resetElementComparator = (a, b) => {
  if (a.type === 'RestElement') {
    return 1;
  }
  if (b.type === 'RestElement') {
    return -1;
  }
  return 0;
};

const getName = (code, { key, type }) => {
  if (type === 'RestElement') {
    return '';
  }
  if (key.name) {
    return key.name;
  }
  if (key.value) {
    return String(key.value);
  }

  return code.substring(key.start, key.end);
};

module.exports = sortObjectAttributes;
