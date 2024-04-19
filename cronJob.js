const cron = require('node-cron');
const { fetchEthereumPrice, storePriceInDB } = require('./controllers/ethereumPrice');

// Cron job to fetch and store Ethereum price every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  console.log('Fetching Ethereum price...');
  try {
      const price = await fetchEthereumPrice();
      await storePriceInDB(price);
  } catch (error) {
      console.error('An error occurred during cron job:', error.message);
  }
});

console.log('Cron job scheduled to fetch Ethereum price every 10 minutes.');
