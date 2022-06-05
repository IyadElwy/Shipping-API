const mongoose = require('mongoose');


//////////////////////////////////////////////////////////////////////////////


const shipmentSchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.ObjectId,
        ref: 'Order',
        required: true
    },
    coordinatesOfCurrentLocation: {
        type: [Number],
        default: [29.95894164031607, 31.260577211060205]
    }
});

//////////////////////////////////////////////////////////////////////////////
const Shipment = mongoose.model('Shipment', shipmentSchema);

module.exports = Shipment;