const express = require('express');
const axios = require('axios');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/task';
const dbName = 'task';
const collectionName = 'transactions';

// API endpoint to fetch Ether price
const etherPriceUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';

// MongoDB client
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Function to calculate user's balance
async function calculateUserBalance(userAddress) {
    let userBalance = 0;
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);


        // Find the document with the given address
    const transaction = await collection.findOne({ address:userAddress });

    if (!transaction) {
      console.log('Transaction not found for the given address.');
      return;
    }

    // Iterate through the data array
    transaction.data.forEach((dataItem) => {
      // You can perform any operation on each dataItem here
      if (dataItem.from === userAddress) {
        userBalance -= parseInt(dataItem.value);
    } else {
        userBalance += parseInt(dataItem.value);
    }
    });
       

        return userBalance;
    } catch (error) {
        console.error('Error calculating user balance:', error.message);
        throw error;
    } finally {
        await client.close();
    }
}

// Function to fetch current Ether price
async function fetchEtherPrice() {
    try {
        const response = await axios.get(etherPriceUrl);
        return response.data.ethereum.usd;
    } catch (error) {
        console.error('Error fetching Ether price:', error.message);
        throw error;
    }
}

// API endpoint to get user balance and Ether price
app.get('/user', async (req, res) => {
    const userAddress = req.query.address;
    try {
        const userBalance = await calculateUserBalance(userAddress);
        const etherPrice = await fetchEtherPrice();
        res.json({ balance: userBalance, etherPrice: etherPrice });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
