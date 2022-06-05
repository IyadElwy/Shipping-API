const express = require("express");

/////////////////////////////////////////////////////////////////////////////////////////////

const shippingControllers = require('../controllers/shippingControllers');
const authControllers = require('../controllers/authController');
/////////////////////////////////////////////////////////////////////////////////////////////

const router = express.Router();

router.route('/')
    .get(authControllers.protect, authControllers.restrictTo('admin'), shippingControllers.getAllShipments)
    .post(authControllers.protect, shippingControllers.createShipment);

router.route('/:id')
    .get(authControllers.protect, authControllers.protectGuest, shippingControllers.getShipment)
    .patch(authControllers.protect, authControllers.protectGuest, shippingControllers.updateOrderStatus);


/////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;
