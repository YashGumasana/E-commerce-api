import express from 'express';
const router = express.Router();

import { createReview, getAllReviews, getReview, updateReview, deleteReview } from '../controller/review_c.js';
import { authenticateUser } from '../middleware/authentication.js';

router.route('/').post(authenticateUser, createReview).get(getAllReviews);

router.route('/:id').get(getReview).patch(authenticateUser, updateReview).delete(authenticateUser, deleteReview);

export default router;