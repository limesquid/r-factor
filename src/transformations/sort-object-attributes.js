const stable = require('stable');
const settings = require('../settings');
const { isSingleLine } = require('../utils/ast');
const { generateIndent } = require('../utils');

const sortObjectAttributes = (code, node, indentSize) => {
  const innerIndent = generateIndent(indentSize + settings.indent);
  const isMultiLine = !isSingleLine(node);
  const buildProperty = createBuildProperty(code, innerIndent, isMultiLine);

  let newCode = '{';
  if (node.properties.length > 0) {
    newCode += isMultiLine ? settings.endOfLine : ' ';
    newCode += buildProperties(node.properties, code, buildProperty);
    newCode += isMultiLine ? settings.trailingComma : '';
    newCode += isMultiLine ? `${settings.endOfLine}${generateIndent(indentSize)}` : ' ';
  }
  newCode += '}';
  return newCode;
};

const buildProperties = (properties, code, buildProperty) => {
  let propertiesCode = '';
  let propertiesToSort = [];
  let lastSpreadElementIndex = -1;
  properties.forEach((property, index) => {
    if (property.type === 'SpreadElement') {
      const sortedProperties = sortProperties(code, propertiesToSort);
      const indexOffset = lastSpreadElementIndex + 1;
      propertiesCode += sortedProperties.map(
        (sortedProperty, sortedPropertyIndex) => buildProperty(
          sortedProperty,
          indexOffset + sortedPropertyIndex,
          properties
        )
      ).join('');
      propertiesCode += buildProperty(property, index, properties);
      lastSpreadElementIndex = index;
      propertiesToSort = [];
    } else {
      propertiesToSort.push(property);
    }
  });
  if (propertiesToSort.length > 0) {
    const sortedProperties = sortProperties(code, propertiesToSort);
    const indexOffset = lastSpreadElementIndex + 1;
    propertiesCode += sortedProperties.map(
      (property, index) => buildProperty(property, indexOffset + index, properties)
    ).join('');
  }
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

  if (property.code) {
    propertyCode += property.code;
  } else if (
    [ 'RestElement', 'SpreadElement', 'ObjectMethod' ].includes(property.type)
    || (property.value && property.value.type === 'AssignmentPattern')
  ) {
    propertyCode += code.substring(property.start, property.end);
  } else {
    propertyCode += code.substring(property.key.start, property.key.end);
  }

  if (property.computed) {
    propertyCode += ']';
  }

  if (property.value && !property.shorthand && property.value.type !== 'AssignmentPattern') {
    propertyCode += ': ';
    propertyCode += code.substring(property.value.start, property.value.end);
  }

  if (index < properties.length - 1) {
    propertyCode += `,${isMultiLine ? settings.endOfLine : ' '}`;
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

const restPropertyComparator = (a) => a.type === 'RestElement' ? 1 : -1;

const getName = (code, { code: name, end, key, start, type, value }) => {
  if ([ 'RestElement', 'SpreadElement' ].includes(type)) {
    return '';
  }

  if (name) {
    return name;
  }

  if (value && value.type === 'AssignmentPattern') {
    return code.substring(start, end);
  }

  if (key && key.value) {
    return String(key.value);
  }

  if (key && key.name) {
    return key.name;
  }

  return code.substring(key.start, key.end);
};

module.exports = sortObjectAttributes;
