import { StatusCodes } from "http-status-codes";

import Order from "../model/order_m.js";
import Product from '../model/product_m.js'
import checkPermissions from "../utils/checkPermission.js";

import { BadRequestError, NotFoundError, UnauthenticatedError } from "../errors/index.js";


const fakeStripeAPI = async ({ amount, currency }) => {
    const client_secret = 'someRandomValue';
    return { client_secret, amount };
}


const createOrder = async (req, res) => {

    const { items: items, tax, shippingFee } = req.body;


    if (!items || items.length < 1) {
        throw new BadRequestError('No cart items provided');
    }

    if (!tax || !shippingFee) {
        throw new BadRequestError('please provide tax and shippinf fee');
    }

    let orderItems = [];
    let subtotal = 0;

    for (const item of items) {
        const dbProduct = await Product.findOne({ _id: item.product });
        if (!dbProduct) {
            throw new NotFoundError(`No product with id : ${item.product}`);
        }
        const { name, price, image, _id } = dbProduct;
        const singleOrderItem = {
            amount: item.amount,
            name,
            price,
            image,
            product: _id,
        };


        orderItems = [...orderItems, singleOrderItem];

        subtotal += item.amount * price;
    }

    const total = tax + shippingFee + subtotal;

    const paymentIntentId = await fakeStripeAPI({
        amount: total,
        currency: 'usd',
    });


    const order = await Order.create({
        orderItems,
        total,
        subtotal,
        tax,
        shippingFee,
        clientSecret: paymentIntentId.client_secret,
        createdBy: req.user.userId,
    });


    res.status(StatusCodes.CREATED).json({ order, clientSecret: order.clientSecret });
}


//

const getAllOrders = async (req, res) => {
    // console.log(req.user.userId);
    const getOrderInfo = await Order.find({});
    // console.log(getOrderInfo);
    res.status(StatusCodes.OK).json({ getOrderInfo, count: getOrderInfo.length });
}


//
const getOrder = async (req, res, next) => {

    const { id: orderId } = req.params;

    const getOneOrder = await Order.findOne({ _id: orderId });
    if (!getOneOrder) {
        return next(BadRequestError(`No task with id : ${orderId}`))
    }

    checkPermissions(req.user, getOneOrder.user);
    res.status(StatusCodes.OK).json({ getOneOrder });
}

const updateOrder = async (req, res, next) => {
    const { id: orderId } = req.params;
    const { paymentIntentId } = req.body;

    const order = await Order.findOne({ _id: orderId });

    if (!order) {
        throw new NotFoundError(`No order with id : ${orderId}`);
    }

    checkPermissions(req.user, order.user);

    order.paymentIntentId = paymentIntentId;
    order.status = 'paid';
    await order.save();

    res.status(StatusCodes.OK).json({ order });
}



const showUserOrder = async (req, res, next) => {
    console.log('----');
    console.log(req.user.userId);
    console.log('***');
    const order = await Order.find({ createdBy: req.user.userId }).sort('createdAt');
    console.log(order);
    res.status(StatusCodes.OK).json({ order, count: order.length });
}

export { createOrder, getAllOrders, getOrder, updateOrder, showUserOrder };