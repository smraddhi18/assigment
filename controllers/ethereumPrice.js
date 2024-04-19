const axios = require('axios');
const db = require('../database');

const collectionName = 'ethereum_prices';
const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr';

async function fetchEthereumPrice() {
  try {
      const response = await axios.get(apiUrl);
      const { ethereum: { inr: price } } = response.data;
      return price;
  } catch (error) {
      console.error('Error fetching Ethereum price:', error.message);
      throw error;
  }
}

async function storePriceInDB(price) {
  try {
      const collection = db.collection(collectionName);
      const timestamp = new Date();
      await collection.insertOne({ timestamp, price });
      console.log('Ethereum price stored successfully.');
  } catch (error) {
      console.error('Error storing Ethereum price in MongoDB:', error.message);
      throw error;
  } 
}

module.exports = { fetchEthereumPrice, storePriceInDB };
