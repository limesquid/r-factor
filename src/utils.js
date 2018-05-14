const generateIndent = (length) => Array.from({ length }).map(() => ' ').join('');
const indentLines = (lines, size) => {
  const indent = generateIndent(Math.abs(size));
  if (size >= 0) {
    return lines.map((line) => `${indent}${line}`);
  }
  return lines.map((line) => line.replace(new RegExp(`^${indent}`, 'i'), ''));
};
const indentCode = (code, size) => code && indentLines(code.split('\n'), size).join('\n');
const squeezeCode = (code, size, squeeze) => {
  const [ first, ...rest ] = code.split('\n');
  return [
    ...indentLines([ first ], size),
    ...indentLines(rest, size - squeeze)
  ].join('\n');
};

module.exports = {
  generateIndent,
  indentCode,
  indentLines,
  squeezeCode
};
