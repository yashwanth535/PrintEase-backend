import express from "express";
import {createOrder, getOrders, deleteOrder, createPaymentOrder, verifyPayment, updateOrderStatus} from '../controllers/order.controller.js';
import authMiddleware from '../middleware/Auth.middlewear.js';
const router = express.Router();

router.get('/', authMiddleware, getOrders);
router.post('/create',authMiddleware,createOrder);
router.delete('/:orderId', authMiddleware, deleteOrder);
router.post('/create-payment', authMiddleware, createPaymentOrder);
router.post('/verify-payment', authMiddleware, verifyPayment);
router.put('/update-status/:orderId', authMiddleware, updateOrderStatus);

export default router;