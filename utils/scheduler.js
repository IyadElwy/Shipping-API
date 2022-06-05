const {ToadScheduler, SimpleIntervalJob, Task, AsyncTask} = require('toad-scheduler');
const axios = require('axios').default;

//////////////////////////////////////////////////////////////////////////////////
const Shiping = require('../models/shippingModel');

//////////////////////////////////////////////////////////////////////////////////

const AppError = require("./appError");

//////////////////////////////////////////////////////////////////////////////////

const scheduler = new ToadScheduler();

//////////////////////////////////////////////////////////////////////////////////

const STATUSLIST = ['CREATED', 'PROCESSING', 'SHIPPING', 'FULFILLED', 'CANCELED'];

//////////////////////////////////////////////////////////////////////////////////


exports.startNewShipment = (shipmentID) => {


    const task = new AsyncTask(
        'simple task', async () => {

            try {


                // get shipment
                const shipment = await Shiping.findById(shipmentID);
                const orderId = shipment.order.valueOf();
                const order = await axios.get(`http://localhost:${process.env.ORDERSPORT}/api/v1/orders/${orderId}`);


                try {
                    switch (order.data.data.data.status) {
                        case 'FULFILLED':
                            scheduler.stopById(shipmentID);
                            break;
                        case 'CANCELED':
                            scheduler.stopById(shipmentID);
                            break;
                        case 'CREATED':
                            await axios.patch(`http://localhost:${process.env.ORDERSPORT}/api/v1/orders/${orderId}`,
                                {
                                    status: 'PROCESSING'
                                });
                            break;
                        case 'PROCESSING':
                            await axios.patch(`http://localhost:${process.env.ORDERSPORT}/api/v1/orders/${orderId}`,
                                {
                                    status: 'SHIPPING'
                                });
                            break;
                        case 'SHIPPING':
                            await axios.patch(`http://localhost:${process.env.ORDERSPORT}/api/v1/orders/${orderId}`,
                                {
                                    status: 'FULFILLED'
                                });
                            break;

                        default:
                            // scheduler.stopById(shipmentID);
                            break;
                    }
                } catch (e) {

                }


            } catch (e) {
                return console.log(e);
            }


        }, shipmentID
    );


    const job = new SimpleIntervalJob({minutes: 5}, task);

    scheduler.addSimpleIntervalJob(job);

};
