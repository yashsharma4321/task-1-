const axios = require('axios');
const Transaction = require('../models/Transaction');

const initializeDatabase = async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;
        await Transaction.insertMany(transactions);
        res.status(200).json({ message: 'Database initialized with seed data' });
    } catch (error) {
        res.status(500).json({ message: 'Error initializing database', error });
    }
};


const listTransactions = async (req, res) => {
    const { month, search, page = 1, per_page = 10 } = req.query;
    const start = (page - 1) * per_page;

    let query = {};
    if (month) {
        query.date_of_sale = { $regex: `-${month.padStart(2, '0')}-`, $options: 'i' };
    }
    if (search) {
        query.$or = [
            { product_title: new RegExp(search, 'i') },
            { product_description: new RegExp(search, 'i') },
            { price: parseFloat(search) }
        ];
    }

    try {
        const transactions = await Transaction.find(query).skip(start).limit(parseInt(per_page));
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', error });
    }
};


const getStatistics = async (req, res) => {
    const { month } = req.query;

    let query = {};
    if (month) {
        query.date_of_sale = { $regex: `-${month.padStart(2, '0')}-`, $options: 'i' };
    }

    try {
        const totalSales = await Transaction.aggregate([
            { $match: query },
            { $group: { _id: null, totalAmount: { $sum: '$price' }, totalSold: { $sum: { $cond: ['$sold', 1, 0] } } } }
        ]);
        const totalItems = await Transaction.countDocuments(query);
        const notSold = totalItems - (totalSales[0]?.totalSold || 0);

        res.status(200).json({
            totalSaleAmount: totalSales[0]?.totalAmount || 0,
            totalSoldItems: totalSales[0]?.totalSold || 0,
            totalNotSoldItems: notSold
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching statistics', error });
    }
};


const getBarChart = async (req, res) => {
    const { month } = req.query;

    let query = {};
    if (month) {
        query.date_of_sale = { $regex: `-${month.padStart(2, '0')}-`, $options: 'i' };
    }

    try {
        const barChart = await Transaction.aggregate([
            { $match: query },
            {
                $bucket: {
                    groupBy: "$price",
                    boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
                    default: "901-above",
                    output: { count: { $sum: 1 } }
                }
            }
        ]);

        res.status(200).json(barChart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bar chart data', error });
    }
};


const getPieChart = async (req, res) => {
    const { month } = req.query;

    let query = {};
    if (month) {
        query.date_of_sale = { $regex: `-${month.padStart(2, '0')}-`, $options: 'i' };
    }

    try {
        const pieChart = await Transaction.aggregate([
            { $match: query },
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        res.status(200).json(pieChart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pie chart data', error });
    }
};

module.exports = {
    initializeDatabase,
    listTransactions,
    getStatistics,
    getBarChart,
    getPieChart
};