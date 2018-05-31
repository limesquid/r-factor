const stable = require('stable');

const composeReversed = (firstFunction, ...restFunctions) => (...args) => restFunctions
  .reduce((result, fn) => fn(result), firstFunction(...args));
const compose = (...functions) => composeReversed(...functions.reverse());
const generateIndent = (length) => Array.from({ length }, () => ' ').join('');
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
const indentCode = (code, size) => code && indentLines(code.split('\n'), size).join('\n');
const removeDoubleNewlines = (code) => code.replace(/\n\n\n/g, '\n');
const squeezeCode = (code, size, restSize) => {
  const [ first, ...rest ] = code.split('\n');
  return [
    indentLine(first, size),
    ...indentLines(rest, restSize)
  ].join('\n');
};
const removeTrailingWhitespace = (code) => code.replace(/[ ]+\n/g, '\n');
const cleanUpCode = compose(removeDoubleNewlines, removeTrailingWhitespace);
const sortPropTypes = (propTypesLines) => stable(
  stable(propTypesLines),
  (prop1, prop2) => prop1.startsWith('on') && !prop2.startsWith('on') ? 1 : 0
);
const getIndent = (code, start) => {
  const lines = code.substring(0, start).split('\n');
  const lastLine = lines[lines.length - 1] || '';
  const matches = lastLine.match(/^(\s+)/);
  return (matches && matches[0] || '').length;
};

module.exports = {
  cleanUpCode,
  generateIndent,
  getIndent,
  indentCode,
  removeDoubleNewlines,
  indentLines,
  removeTrailingWhitespace,
  sortPropTypes,
  squeezeCode
};
