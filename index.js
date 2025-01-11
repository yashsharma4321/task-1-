const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());


app.use('/api', apiRoutes);

mongoose.connect('mongodb://localhost:27017/transactionDB1')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
