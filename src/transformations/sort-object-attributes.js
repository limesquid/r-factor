const stable = require('stable');
const { isSingleLine } = require('../utils/ast');
const { generateIndent } = require('../utils');

const sortObjectAttributes = (code, indentSize, node) => {
  const innerIndent = generateIndent(indentSize + 2);
  const isMultiLine = !isSingleLine(node);
  const buildProperty = createBuildProperty(code, innerIndent, isMultiLine);

  let newCode = '{';
  newCode += isMultiLine ? '\n' : ' ';
  newCode += buildProperties(node.properties, code, buildProperty);
  newCode += isMultiLine ? `\n${generateIndent(indentSize)}` : ' ';
  newCode += '}';
  return newCode;
};

const buildProperties = (properties, code, buildProperty) => {
  let propertiesCode = '';
  let propertiesToSort = [];
  properties.forEach((property, index) => {
    if (property.type === 'SpreadElement') {
      const sortedProperties = sortProperties(code, propertiesToSort);
      propertiesCode += sortedProperties.map(
        (sortedProperty) => buildProperty(sortedProperty, index, properties)
      ).join('');
      propertiesCode += buildProperty(property, index, properties);
      propertiesToSort = [];
    } else {
      propertiesToSort.push(property);
    }
  });
  const sortedProperties = sortProperties(code, propertiesToSort);
  const indexOffset = properties.length - sortedProperties.length;
  propertiesCode += sortedProperties.map(
    (property, index) => buildProperty(property, indexOffset + index, properties)
  ).join('');
  return propertiesCode;
};

const createBuildProperty = (code, innerIndent, isMultiLine) => (property, index, properties) => {
  let propertyCode = '';

  if (isMultiLine) {
    propertyCode += innerIndent;
  }

  if (property.computed) {
    propertyCode += '[';
  }

  if ([ 'RestElement', 'SpreadElement' ].includes(property.type)) {
    propertyCode += code.substring(property.start, property.end);
  } else {
    propertyCode += code.substring(property.key.start, property.key.end);
  }

  if (property.computed) {
    propertyCode += ']';
  }

  if (property.value && !property.shorthand) {
    propertyCode += ': ';
    propertyCode += code.substring(property.value.start, property.value.end);
  }

  if (index < properties.length - 1) {
    propertyCode += ',';

    if (isMultiLine) {
      propertyCode += '\n';
    } else {
      propertyCode += ' ';
    }
  }

  return propertyCode;
};

const sortProperties = (code, properties) => {
  const propertiesWithNames = properties.map((property) => ({
    ...property,
    name: getName(code, property)
  }));

  return stable(
    stable(propertiesWithNames, propertyComparator),
    restPropertyComparator
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

const restPropertyComparator = (a, b) => {
  if (a.type === 'RestElement') {
    return 1;
  }

  if (b.type === 'RestElement') {
    return -1;
  }

  return 0;
};

const getName = (code, { key, type }) => {
  if ([ 'RestElement', 'SpreadElement' ].includes(type)) {
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
