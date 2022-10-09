import { StatusCodes } from "http-status-codes";

import Review from "../model/review_m.js";
import Product from "../model/product_m.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import checkPermissions from "../utils/checkPermission.js";

const createReview = async (req, res) => {
    const { product: productId } = req.body;

    const isValidProduct = await Product.findOne({ _id: productId });

    if (!isValidProduct) {
        throw new NotFoundError(`No product with id : ${productId}`);
    }

    console.log(productId);
    console.log(req.user.userId);

    const alreadySubmitted = await Review.findOne({
        product: productId,
        createdBy: req.user.userId
    })

    if (alreadySubmitted) {
        throw new BadRequestError('Already submitted review for this product');
    }

    req.body.createdBy = req.user.userId;
    const review = await Review.create(req.body);
    res.status(StatusCodes.CREATED).json({ review });
}

const getAllReviews = async (req, res) => {
    const reviews = await Review.find({}).populate({
        path: 'product',
        select: 'name company price'
    });

    res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getReview = async (req, res) => {
    const { id: reviewId } = req.params;

    const review = await Review.findOne({ _id: reviewId });

    if (!review) {
        throw new NotFoundError(`No review with id ${reviewId}`);
    }

    res.status(StatusCodes.OK).json({ review });
}


const updateReview = async (req, res) => {
    const { id: reviewId } = req.params;
    const { rating, title, comment } = req.body;

    const review = await Review.findOne({ _id: reviewId });

    if (!review) {
        throw new NotFoundError(`No review with id ${reviewId}`);
    }

    console.log('***');
    console.log(req.user);
    console.log(review.createdBy);
    console.log('++');
    checkPermissions(req.user, review.createdBy);

    review.rating = rating;
    review.title = title;
    review.comment = comment;

    await review.save();
    res.status(StatusCodes.OK).json({ review });
}

const deleteReview = async (req, res) => {
    const { id: reviewId } = req.params;

    const review = await Review.findOne({ _id: reviewId });

    if (!review) {
        throw new NotFoundError(`No review with id ${reviewId}`);
    }

    checkPermissions(req.user, review.createdBy);
    await review.remove();
    res.status(StatusCodes.OK).json({ msg: 'Success! Review removed' })
}

const getSingleProductReviews = async (req, res) => {
    const { id: productId } = req.params;
    const reviews = await Review.find({ product: productId });
    res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
}

export { createReview, getAllReviews, getReview, updateReview, deleteReview, getSingleProductReviews };