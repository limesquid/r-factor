const stable = require('stable');
const settings = require('../settings');

const composeReversed = (firstFunction, ...restFunctions) => (...args) => restFunctions
  .reduce((result, fn) => fn(result), firstFunction(...args));
const compose = (...functions) => composeReversed(...functions.reverse());
const generateIndent = (length) => Array.from({ length }, () => settings.indentCharacter).join('');
const indentLines = (lines, size) => lines.map((line) => indentLine(line, size));
const indentLine = (line, size) => {
  if (!size) {
    return line;
  }
  const indent = generateIndent(Math.abs(size));
  if (size > 0) {
    return `${indent}${line}`;
  }
  return line.replace(new RegExp(`^${indent}`, 'i'), '');
};
const indentCode = (code, size) => code && indentLines(code.split(settings.endOfLine), size).join(settings.endOfLine);
const removeMultipleSemicolons = (code) => code.replace(/;{2,}/g, ';');
const removeDoubleNewlines = (code) => code
  .replace(
    new RegExp(`${settings.endOfLine}${settings.endOfLine}${settings.endOfLine}`, 'g'),
    settings.endOfLine
  )
  .replace(
    new RegExp(`${settings.endOfLine}\\s*${settings.endOfLine}\\s*${settings.endOfLine}`, 'g'),
    settings.doubleEndOfLine
  );
const squeezeCode = (code, size, restSize) => {
  const [ first, ...rest ] = code.split(settings.endOfLine);
  return [
    indentLine(first, size),
    ...indentLines(rest, restSize)
  ].join(settings.endOfLine);
};
const removeTrailingWhitespace = (code) => code.replace(
  new RegExp(`[ ]+${settings.endOfLine}`, 'g'),
  settings.endOfLine
);
const cleanUpCode = compose(removeDoubleNewlines, removeTrailingWhitespace, removeMultipleSemicolons);
const sortPropTypes = (propTypesLines) => stable(
  stable(propTypesLines),
  (prop1, prop2) => prop1.startsWith('on') && !prop2.startsWith('on') ? 1 : 0
);
const isString = (value) => {
  if (value.length >= 2) {
    return typeof value === 'string' && [
      value.startsWith('"') && value.endsWith('"'),
      value.startsWith('\'') && value.endsWith('\'')
    ].some(Boolean);
  }
  return false;
};
const getIndent = (code, start) => {
  const lines = code.substring(0, start).split(settings.endOfLine);
  const lastLine = lines[lines.length - 1] || '';
  const matches = lastLine.match(/^(\s+)/);
  return (matches && matches[0] || '').length;
};

module.exports = {
  cleanUpCode,
  generateIndent,
  getIndent,
  indentCode,
  indentLines,
  isString,
  removeDoubleNewlines,
  removeTrailingWhitespace,
  sortPropTypes,
  squeezeCode
};
