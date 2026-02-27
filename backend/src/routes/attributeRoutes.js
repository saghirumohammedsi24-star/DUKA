const express = require('express');
const { getAttributes, createAttribute, addOption, deleteAttribute } = require('../controllers/attributeController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getAttributes);
router.post('/', authenticate, authorize(['admin']), createAttribute);
router.post('/:attributeId/options', authenticate, authorize(['admin']), upload.single('media'), addOption);
router.delete('/:id', authenticate, authorize(['admin']), deleteAttribute);

module.exports = router;
