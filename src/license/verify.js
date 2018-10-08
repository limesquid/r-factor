const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const LICENSE_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArTes262OG4eY8RDAEKFo
w25lLGmDybuT8GAuOjnXnaGfWrevUcsBEBVs3SzUkcUHPP9pMq9Cus5w9+b8wfau
Q+pFwdZe4TIgi4A/1X9KjMeuvXB/BxNkLQBxnmwiSoPADL+Y+/6Ginlj57KU4BGc
p4MSISlDPMvz4GR99AdC/R1swlA4QR2O8/Y2nelKhPjXuUbmegR3OzAa6+T1WOLA
VwJuhx91/2eROvIPG8t+LLky1XRQa+sdcEywR1nKa2L5to32UIRSg+Houq3ObF9c
WaYPv3VXZinO2jXtnUafKDWqFmqzCjLiY8cshqpKlEvrVQdGF6/R/BwXfAFcx6lx
qwIDAQAB
-----END PUBLIC KEY-----`;

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
