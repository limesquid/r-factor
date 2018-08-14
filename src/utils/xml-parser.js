const xml2js = require('xml2js');

const parse = (xml) => {
  let result = null;
  let parsingError = null;
  xml2js.parseString(xml, (error, parsed) => {
    parsingError = error;
    result = parsed;
  });

  if (parsingError) {
    throw parsingError;
  }

  return result;
};

module.exports = {
  parse
};
