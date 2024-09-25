const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  idNumber: String,
  phoneNumber: String,
  email: String,
  password: String
});


module.exports = mongoose.model('Accounts', userSchema);