const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  address: String,
  data: [Object] // Assuming data can be an array of objects
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
