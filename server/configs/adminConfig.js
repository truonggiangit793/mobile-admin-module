const bcrypt = require('bcrypt');
const purePassword = process.env.ADMIN_PASSWORD || '123456';
const hashPassword = bcrypt.hashSync(purePassword, bcrypt.genSaltSync(10));

module.exports = {
  userCode: 'ADMIN',
  fullName: 'ADMINISTRATOR',
  password: hashPassword,
  role: 'ADMIN',
  email: 'admin@example.com',
};
