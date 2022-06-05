const axios = require('axios').default;

/////////////////////////////////////////////////////////////////////////////////////////////

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

/////////////////////////////////////////////////////////////////////////////////////////////

exports.protect = catchAsync(async (req, res, next) => {

    let token;

    // 1) Getting token and checking if it exists
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    // TODO
    try {

        let user = await axios.get(`http://localhost:${process.env.DEVROUTESPORT}/api/v1/devroutes/${process.env.DEVROUTESKEY}/retrieveuser/${token}`);

        req.user = user.data.user;

    } catch (e) {

        return next();
    }

    // Grant accesses to protected route

    next();
});


exports.protectGuest = catchAsync(async (req, res, next) => {

    if (req.user) {
        return next();
    }


    let token;

    // 1) Getting token and checking if it exists
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    // TODO
    try {

        let user = await axios.get(`http://localhost:${process.env.DEVROUTESPORT}/api/v1/devroutes/${process.env.DEVROUTESKEY}/retrieveguestuser/${token}`);

        req.user = user.data.user;

    } catch (e) {

        return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    // Grant accesses to protected route

    next();
});


exports.restrictTo = (role) => {
    return catchAsync(async (req, res, next) => {


        // 2) check if his role is valid by getting roles from parameter
        if (role !== req.user.role) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }

        next();
    });

};
