const axios = require('axios');
const Transaction = require('../models/Transactions');

// Etherscan API Key
const API_KEY = '4BW792WQ48Z8NY3JYKTTED1QBRDVZB42CU';

async function getTransactions(req, res) {
  try {
    const address = req.params.address;
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${API_KEY}`;
    const response = await axios.get(url);

    // Check if a transaction with the given address exists in the database
    const existingTransaction = await Transaction.findOne({ address: address });

    if (existingTransaction) {
      // If a transaction with the given address is found, return it
      return res.json(existingTransaction);
    }

    // Store transactions in MongoDB
    const newTransaction = await Transaction.create({
      address: address,
      data: response.data.result
    });
    res.json(newTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getTransactions
};
