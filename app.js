const express = require('express');
const app = express();


require('dotenv').config();


const connectDB = require('./db');
connectDB();


app.use(express.json());


app.get('/', (req, res) => {
  res.status(200).send('Voice for Her API is running');
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
