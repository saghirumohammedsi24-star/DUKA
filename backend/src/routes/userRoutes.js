const express = require('express');
const {
    getProfile, updateProfile, getAddresses, addAddress, deleteAddress, setDefaultAddress
} = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.delete('/addresses/:id', deleteAddress);
router.put('/addresses/:id/default', setDefaultAddress);

module.exports = router;
