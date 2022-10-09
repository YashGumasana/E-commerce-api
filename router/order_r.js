import express from 'express';
const router = express.Router();

import {
    authenticateUser,
    authorizePermissions
} from '../middleware/authentication.js'
import { createOrder, getAllOrders, getOrder, updateOrder, showUserOrder } from '../controller/order_c.js';

router.route('/').post(authenticateUser, createOrder)
    .get(authenticateUser, authorizePermissions('admin'), getAllOrders);

router.route('/currentUserOrder').get(authenticateUser, showUserOrder);


router.route('/:id').get(authenticateUser, getOrder).patch(authenticateUser, updateOrder);



export default router;