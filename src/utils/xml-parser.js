const xml2js = require('xml2js');

const parse = (xml) => {
  let result = '';
  xml2js.parseString(xml, (error, parsed) => {
    result = parsed;
  });
  return result;
};

module.exports = {
  parse
};
