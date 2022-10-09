import { StatusCodes } from "http-status-codes";
import path from 'path';

import Product from "../model/product_m.js";
import { NotFoundError, BadRequestError } from "../errors/index.js";



const createProduct = async (req, res) => {

    req.body.createdBy = req.user.userId;

    const product = await Product.create(req.body);

    res.status(StatusCodes.CREATED).json({ product });
}

const getAllProducts = async (req, res) => {
    const products = await Product.find({});
    res.status(StatusCodes.OK).json({ products, count: products.length });
}

const getProduct = async (req, res) => {
    const { id: productId } = req.params;

    const product = await Product.findOne({
        _id: productId,
    }).populate('reviews')
    // .populate('reviews');

    if (!product) {
        throw new NotFoundError(`No job with id ${productId}`);
    }
    res.status(StatusCodes.OK).json({ product });
}

const updateProduct = async (req, res) => {
    const {
        id: productId
    } = req.params;

    const product = await Product.findOneAndUpdate(
        {
            _id: productId
        },
        req.body,
        { new: true, runValidators: true }
    );

    if (!product) {
        throw new NotFoundError(`No job with id ${productId}`);
    }
    res.status(StatusCodes.OK).json({ product });
}

const deleteProduct = async (req, res) => {
    const {
        id: productId,
    } = req.params;

    const product = await Product.findByIdAndRemove({
        _id: productId,
    });

    if (!product) {
        throw new NotFoundError(`No job with id ${productId}`);
    }
    res.status(StatusCodes.OK).json({ msg: 'Success! Product removed' });
}


const uploadImage = async (req, res) => {
    if (!req.files) {
        throw new BadRequestError('No File Uploaded');
    }
    const productImage = req.files.image;

    if (!productImage.mimetype.startsWith('image')) {
        throw new BadRequestError('Please Upload Image');
    }

    const maxSize = 1024 * 1024;


    if (productImage.size > maxSize) {
        throw new BadRequestError('Please upload image smaller than 1MB');
    }

    // console.log(__dirname);
    const imagePath = path.join(__dirname, '../public/uploads' + `${productImage.name}`
    );

    await productImage.mv(imagePath);
    res.status(StatusCodes.OK).json({
        image: `/uploads/${productImage.name}`
    });
};


export { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct, uploadImage };