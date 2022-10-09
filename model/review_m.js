import mongoose from "mongoose";

const ReviewSchema = mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please provide rating'],
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'Please provide review title'],
        maxlength: 100
    },
    comment: {
        type: String,
        required: [true, 'Please provide review text'],
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'Auth',
        require: true,
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        require: true,
    },
},
    { timestamps: true }
);

export default mongoose.model('Review', ReviewSchema);