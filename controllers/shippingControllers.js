const Shipment = require('../models/shippingModel');
const generalController = require('./generalControllers');
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const scheduler = require('../utils/scheduler');

///////////////////////////////////////////////////////////////////////////////
const axios = require('axios').default;

///////////////////////////////////////////////////////////////////////////////

// exports.createShipment = generalController.createOne(Shipment);

exports.createShipment = catchAsync(async (req, res, next) => {

    const doc = await Shipment.create(req.body);

    // For simulation
    scheduler.startNewShipment(doc._id.valueOf());


    res.status(201).json({
        status: "Success",
        data: doc,
    });

});

///////////////////////////////////////////////////////////////////////////////

exports.getShipment = generalController.getOne(Shipment);
exports.getAllShipments = generalController.getAll(Shipment);

/////////////////////////////////////////////////////////////////////////////////////////////

exports.updateOrderStatus = catchAsync(
    async (req, res, next) => {
        const shippingId = req.params.id;

        // update order status
        try {
            let orderId = await Shipment.findById(shippingId);
            orderId = orderId.order.valueOf();

            const order = await axios.patch(`http://localhost:${process.env.ORDERSPORT}/api/v1/orders/${orderId}`, req.body);

            // 1) if order status is Fulfilled:
            if (order.data.data.data.status === 'FULFILLED') {
                // 2) get current user and if user is guest delete account

                if (req.user.role === 'guestuser') {
                    await axios.delete(`http://localhost:${process.env.DEVROUTESPORT}/api/v1/guestusers/${req.user._id}`);
                }

            }


            res.status(200).json({
                status: 'success',
                data: {
                    data: order.data.data
                }
            });


        } catch (e) {

            return next(new AppError('Error occured while updating order status.', 401));
        }


    });

/////////////////////////////////////////////////////////////////////////////////////////////
