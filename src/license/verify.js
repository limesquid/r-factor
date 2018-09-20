const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const LICENSE_PUBLIC_KEY = require('./license.key.pub');

const sha256 = (string) => crypto.createHash('sha256').update(string).digest('hex');

const verifyLicense = (license) => {
  try {
    const details = jwt.verify(license, LICENSE_PUBLIC_KEY);
    const { fullName, email, key } = details;
    return key === sha256(`${fullName}:${process.env.LICENSE_SECRET}:${email}`);
  } catch (error) {
    return false;
  }
};

module.exports = verifyLicense;
