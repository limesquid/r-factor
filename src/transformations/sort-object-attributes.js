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
    newCode += buildProperties(node, code, buildProperty);
    newCode += isMultiLine ? settings.trailingComma : '';
    newCode += isMultiLine ? `${settings.endOfLine}${generateIndent(indentSize)}` : ' ';
  }
  newCode += '}';
  return newCode;
};

const buildProperties = (node, code, buildProperty) => {
  const lines = code.split('\n');
  const properties = mapNodeProperties(node, lines);
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
    if (property.code) {
      propertyCode += innerIndent;
    } else {
      const { codeBefore } = property;
      if (property.originalIndex === 0) {
        if (codeBefore.code) {
          propertyCode += codeBefore.code + settings.endOfLine + codeBefore.linePrefix;
        } else {
          propertyCode += codeBefore.linePrefix;
        }
      } else {
        propertyCode += codeBefore.code + codeBefore.linePrefix;
      }
    }
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

  const hasCommaAfter = property.codeAfter.trim().startsWith(',');
  const comma = hasCommaAfter ? '' : ',';

  if (property.code) {
    if (index < properties.length - 1) {
      propertyCode += `,${isMultiLine ? settings.endOfLine : ' '}`;
    }
  } else if (index < properties.length - 1) {
    propertyCode += `${comma}${property.codeAfter}${isMultiLine ? settings.endOfLine : ' '}`;
  } else {
    propertyCode += hasCommaAfter ? property.codeAfter.replace(',', '') : property.codeAfter;
  }

  return propertyCode;
};

const mapNodeProperties = (node, lines) => {
  const isMultiLine = !isSingleLine(node);
  return node.properties.map((property, index) => ({
    ...property,
    originalIndex: index,
    codeBefore: isMultiLine ? getCodeBeforeProperty(node, lines, index) : '',
    codeAfter: isMultiLine ? getCodeAfterProperty(node, lines, index) : ''
  }));
};

const getCodeBeforeProperty = (node, lines, index) => {
  const { property, previousProperty } = getPropertiesNeighborhood(node, index);
  if (property.code) {
    return {
      code: '',
      linePrefix: ''
    };
  }
  const line = lines[property.loc.start.line - 1];
  const linePrefix = line.substring(0, property.loc.start.column);

  const previousPropertyEndsOnPreviousLine = previousProperty.loc.end.line === property.loc.start.line - 1;
  if (!previousPropertyEndsOnPreviousLine || index === 0) {
    const endOfLine = index === 0 ? '' : settings.endOfLine;
    return {
      code: lines.slice(previousProperty.loc.end.line, property.loc.start.line - 1).join('\n') + endOfLine,
      linePrefix
    };
  }

  return {
    code: '',
    linePrefix
  };
};

const getCodeAfterProperty = (node, lines, index) => {
  const { property } = getPropertiesNeighborhood(node, index);
  if (property.code) {
    return '';
  }
  const line = lines[property.loc.end.line - 1];
  const lineSuffix = line.substring(property.loc.end.column);
  return lineSuffix;
};

const getPropertiesNeighborhood = ({ properties, loc }, index) => ({
  property: properties[index],
  previousProperty: properties[index - 1] || { loc: { end: { line: loc.start.line } } }
});

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
