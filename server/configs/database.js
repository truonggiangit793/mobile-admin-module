const database_uri = process.env.DB_URL;
const mongoose = require('mongoose');
const accountModel = require('../models/account');
const adminConfig = require('./adminConfig');

const query = {userCode: adminConfig.userCode},
  update = adminConfig,
  options = {upsert: true, new: true, setDefaultsOnInsert: true};

const connect = async function () {
  mongoose
    .connect(database_uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(
      () => {
        console.log('✅ Connect to mongoDB successfully!');
        accountModel.findOneAndUpdate(
          query,
          update,
          options,
          function (error, result) {
            if (error) {
              console.log(
                '\x1b[31m%s\x1b[0m',
                'Failed to initial administrator!',
              );
              console.error('\x1b[31m%s\x1b[0m', `Error: ${error.message}`);
            } else {
              result = !result ? new accountModel() : result;
              result.save();
              console.log('✅ Initial administrator account successfully!\n\n');
            }
          },
        );
      },
      error => {
        console.log('\x1b[31m%s\x1b[0m', 'Failed to connect to MongoDB!');
        console.log('\x1b[31m%s\x1b[0m', error.message);
      },
    );
};

module.exports = {connect};
