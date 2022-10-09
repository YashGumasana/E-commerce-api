import express from 'express';
const router = express.Router();

import { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct, uploadImage } from "../controller/product_c.js";

import { getSingleProductReviews } from '../controller/review_c.js';

import {
    authenticateUser,
    authorizePermissions
} from '../middleware/authentication.js'

router.route('/').post(authenticateUser, authorizePermissions('admin'), createProduct);
router.route('/').get(getAllProducts);


router.route('/:id').get(getProduct);
router.route('/:id').patch([authenticateUser, authorizePermissions('admin')], updateProduct);
router.route('/:id').delete([authenticateUser, authorizePermissions('admin')], deleteProduct);

router.route('/uploadImage').post([authenticateUser, authorizePermissions('admin')], uploadImage);

router.route('/:id/reviews').get(getSingleProductReviews);

export default router;
