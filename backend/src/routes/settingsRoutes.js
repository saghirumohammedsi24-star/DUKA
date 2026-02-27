const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, getSettings);
router.put('/', authenticate, authorize(['admin']), updateSettings);

module.exports = router;
