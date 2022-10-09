import mongoose from "mongoose";

const SubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide name'],
    },
    price: {
        type: Number,
        required: [true, 'please provide price'],
    },
    image: {
        type: String,
        required: [true, 'please provide image'],
    },
    amount: {
        type: Number,
        required: [true, 'please provide amount'],
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'provide product id']
    },
});

const OrderSchema = new mongoose.Schema({
    tax: {
        type: String,
        required: [true, 'please provide tax'],
    },
    shippingFee: {
        type: String,
        required: [true, 'please provide shippingFee'],
    },
    subtotal: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    items: [SubSchema],

    status: {
        type: String,
        enum: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
        default: 'pending',
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Auth',
        required: true
    },
    clientSecret: {
        type: String,
        required: true,
    },
    paymentIntentId: {
        type: String,
    },
},
    { timestamps: true }
);

export default mongoose.model('Order', OrderSchema);