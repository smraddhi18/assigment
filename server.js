const express = require('express');
const transactionRoutes = require('./routes/transactionRoute');
require('./cronJob');
require('dotenv').config

const app = express();
const PORT = process.env.PORT || 8081;

app.use('/transactions', transactionRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
