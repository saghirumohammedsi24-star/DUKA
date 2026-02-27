const express = require('express');
const { getDashboardSummary } = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/summary', authenticate, authorize(['admin']), getDashboardSummary);

module.exports = router;
