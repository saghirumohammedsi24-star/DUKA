const Dashboard = require('../models/dashboardModel');

const getDashboardSummary = async (req, res, next) => {
    try {
        const summary = await Dashboard.getSummary();
        res.json(summary);
    } catch (err) {
        next(err);
    }
};

module.exports = { getDashboardSummary };
