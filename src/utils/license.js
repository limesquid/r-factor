const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// eslint-disable-next-line
const LICENSE_SECRET = 'YC3@6jyLqq%!b#Br22iL7h9hmn%TYEGw5SoJVCrXWcAAzykoqXHkqX8AwJwbIVlR^PCnzbq%7W5x^&BYZObsr*IbrP&VmxanuxOU';

const md5 = (string) => crypto.createHash('md5').update(string).digest('hex');

const verifyLicense = (license) => {
  try {
    const details = jwt.verify(license, LICENSE_SECRET);
    const { fullname, email, key } = details;
    return key === md5(`${fullname}:${LICENSE_SECRET}:${email}`);
  } catch (error) {
    return false;
  }
};

module.exports = {
  verifyLicense
};
