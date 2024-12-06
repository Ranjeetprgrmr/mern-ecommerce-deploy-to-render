const express = require('express');

const { createOrder, capturePayment, getOrderDetails, getAllOrdersByUser } = require('../../controllers/shop/order-controller');

const router = express.Router();

router.put('/create', createOrder);
router.post('/capture', capturePayment);
router.get('/list/:userId', getAllOrdersByUser);
router.get('/details/:id', getOrderDetails);

module.exports = router;