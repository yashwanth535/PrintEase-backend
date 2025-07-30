import {User} from '../models/User_Collection.js';
import {Order} from '../models/order.js';
import { Cashfree, CFEnvironment } from "cashfree-pg";

const createOrder = async (req,res) => {
    try{
        const userId = req.user.id;
        const {fileUrl,totalPrice,pages,color,sets,size,binding,notes,vendorId} = req.body;
        
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({success: false, message: 'User not found'});
        }
        
        // Create the order
        const order = new Order({
            fileUrl,
            totalPrice,
            pages,
            color,
            sets,
            size,
            binding,
            notes,
            userId,
            vendorId
        });
        
        await order.save();
        
        // Add order ID to user's orders array
        user.orders.push(order._id);
        await user.save();
        
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order
        });
    }catch(error){
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
}

const getOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        // Get all orders for this user using the order IDs from user's orders array
        const orders = await Order.find({ _id: { $in: user.orders } })
            .populate('vendorId', 'shopName location contactNumber')
            .sort({ createdAt: -1 }); // Sort by newest first
        
        res.status(200).json({
            success: true,
            message: 'Orders fetched successfully',
            orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
}

const deleteOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { orderId } = req.params;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        // Check if order belongs to user
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        if (order.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this order' });
        }
        
        // Only allow deletion of pending orders
        if (order.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Only pending orders can be deleted' });
        }
        
        // Delete the order
        await Order.findByIdAndDelete(orderId);
        
        // Remove order ID from user's orders array
        user.orders = user.orders.filter(id => id.toString() !== orderId);
        await user.save();
        
        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting order',
            error: error.message
        });
    }
}

const createPaymentOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { orderIds, customerDetails } = req.body;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Get the selected orders
        const orders = await Order.find({ 
            _id: { $in: orderIds },
            userId: userId,
            status: 'pending'
        });

        if (orders.length === 0) {
            return res.status(400).json({ success: false, message: 'No valid orders found' });
        }

        // Calculate total amount
        const totalAmount = orders.reduce((sum, order) => sum + order.totalPrice, 0);

        // Initialize Cashfree SDK
        const environment = process.env.NODE_ENV === 'production' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX;
        const cashfree = new Cashfree(
            environment,
            process.env.CASHFREE_CLIENT_ID,
            process.env.CASHFREE_CLIENT_SECRET
        );

        // Create Cashfree payment order request
        const request = {
            order_amount: totalAmount.toFixed(2),
            order_currency: "INR",
            customer_details: {
                customer_id: userId,
                customer_name: customerDetails.name || "Customer",
                customer_email: customerDetails.email || user.email,
                customer_phone: customerDetails.phone || "9999999999"
            },
            order_meta: {
                return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/u/payment-success?order_id={order_id}`
            },
            order_note: `PrintEase order for ${orders.length} items`
        };

        // Create order using Cashfree SDK
        const response = await cashfree.PGCreateOrder(request);
        const cashfreeData = response.data;

        // Store payment details in orders
        for (let order of orders) {
            order.paymentOrderId = cashfreeData.order_id;
            order.paymentSessionId = cashfreeData.payment_session_id;
            order.cfOrderId = cashfreeData.cf_order_id;
            await order.save();
        }

        res.status(200).json({
            success: true,
            message: 'Payment order created successfully',
            paymentSessionId: cashfreeData.payment_session_id,
            orderId: cashfreeData.order_id,
            cfOrderId: cashfreeData.cf_order_id,
            amount: totalAmount
        });

    } catch (error) {
        console.error('Error creating payment order:', error);
        
        // Handle Cashfree SDK specific errors
        if (error.response && error.response.data) {
            return res.status(400).json({ 
                success: false, 
                message: 'Payment gateway error',
                error: error.response.data
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error creating payment order',
            error: error.message
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        
        // Initialize Cashfree SDK
        const environment = process.env.NODE_ENV === 'production' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX;
        const cashfree = new Cashfree(
            environment,
            process.env.CASHFREE_CLIENT_ID,
            process.env.CASHFREE_CLIENT_SECRET
        );

        // Verify payment with Cashfree SDK
        const response = await cashfree.PGFetchOrder(orderId);
        const cashfreeData = response.data;

        // Check if payment is successful
        const isPaid = cashfreeData.order_status === 'PAID';

        if (isPaid) {
            // Update all orders with this payment order ID
            const orders = await Order.find({ paymentOrderId: orderId });
            
            for (let order of orders) {
                order.status = 'accepted';
                order.paymentStatus = 'paid';
                order.paidAt = new Date();
                await order.save();
            }

            res.status(200).json({
                success: true,
                message: 'Payment verified successfully',
                isPaid: true,
                orderStatus: cashfreeData.order_status,
                ordersUpdated: orders.length
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'Payment not completed',
                isPaid: false,
                orderStatus: cashfreeData.order_status
            });
        }

    } catch (error) {
        console.error('Error verifying payment:', error);
        
        // Handle Cashfree SDK specific errors
        if (error.response && error.response.data) {
            return res.status(400).json({ 
                success: false, 
                message: 'Payment verification failed',
                error: error.response.data
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error verifying payment',
            error: error.message
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const userId = req.user.id;

        const order = await Order.findOne({ _id: orderId, userId: userId });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order
        });

    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating order status',
            error: error.message
        });
    }
};

export { createOrder, getOrders, deleteOrder, createPaymentOrder, verifyPayment, updateOrderStatus };