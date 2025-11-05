import express from "express";
import {createOrder, getOrders, deleteOrder, createPaymentOrder, verifyPayment, updateOrderStatus} from '../controllers/order.controller.js';
import authMiddleware from '../middleware/Auth.middlewear.js';
import mobileMiddleware from '../middleware/mobile.middlewear.js'
const router = express.Router();

router.get('/', authMiddleware, getOrders);
router.post('/create',authMiddleware,createOrder);
router.delete('/:orderId', authMiddleware, deleteOrder);
router.post('/create-payment', authMiddleware, createPaymentOrder);
router.post('/verify-payment', authMiddleware, verifyPayment);
router.put('/update-status/:orderId', authMiddleware, updateOrderStatus);

router.post('/mobile', mobileMiddleware, getOrders);
router.post('/mobile/create',mobileMiddleware,createOrder);
router.delete('/mobile/:orderId', mobileMiddleware, deleteOrder);
router.post('/mobile/create-payment', mobileMiddleware, createPaymentOrder);
router.post('/mobile/verify-payment', mobileMiddleware, verifyPayment);
router.put('/mobile/update-status/:orderId', mobileMiddleware, updateOrderStatus);

export default router;