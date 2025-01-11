const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    product_title: String,
    product_description: String,
    price: Number,
    date_of_sale: Date,
    category: String,
    sold: Boolean
});

module.exports = mongoose.model('Transaction', transactionSchema);