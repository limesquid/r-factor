const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// eslint-disable-next-line
const LICENSE_SECRET = 'YC3@6jyLqq%!b#Br22iL7h9hmn%TYEGw5SoJVCrXWcAAzykoqXHkqX8AwJwbIVlR^PCnzbq%7W5x^&BYZObsr*IbrP&VmxanuxOU';
const LICENSE_PUBLIC_KEY = process.env.LICENSE_PUBLIC_KEY;

const sha256 = (string) => crypto.createHash('sha256').update(string).digest('hex');

const verifyLicense = (license) => {
  try {
    const details = jwt.verify(license, LICENSE_PUBLIC_KEY);
    const { fullname, email, key } = details;
    return key === sha256(`${fullname}:${LICENSE_SECRET}:${email}`);
  } catch (error) {
    return false;
  }
};

module.exports = {
  verifyLicense
};
