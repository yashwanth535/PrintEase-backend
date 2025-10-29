import { User, Vendor } from '../models/User_Collection.js';
import {Order} from '../models/order.js';
import { sendEmail } from '../utils/email.js';
import {getOrderCompletedEmailHTML,getPaymentSuccessTemplate} from '../utils/mailTemplates.js'
import { Cashfree, CFEnvironment } from "cashfree-pg";
import supabase from '../config/supabase.config.js';

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
        
        // Log entry
        await User.findByIdAndUpdate(userId, { $push: { logs: { message: `Order ${order._id} created`, createdAt: new Date() } } });
        
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

const getVendorOrders = async (req, res) => {
    try {
        const vendorId = req.user.id;

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Vendor not found' });
        }

        const orders = await Order.find({ vendorId })
            .populate('userId', 'email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Error fetching vendor orders:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching vendor orders',
            error: error.message
        });
    }
};

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
        
        // Log entry
        await User.findByIdAndUpdate(userId, { $push: { logs: { message: `Order ${orderId} deleted`, createdAt: new Date() } } });
        
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
        const { orderIds } = req.body;
        
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
        var totalAmount = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        totalAmount+=totalAmount*0.05;
        totalAmount=totalAmount.toFixed(2)

        // Initialize Cashfree SDK
        const environment = process.env.PROD === 'true' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX;
        const cashfree = new Cashfree(
            environment,
            process.env.CASHFREE_CLIENT_ID,
            process.env.CASHFREE_CLIENT_SECRET
        );

        // Create Cashfree payment order request
        const request = {
            order_amount: totalAmount,
            order_currency: "INR",
            customer_details: {
                customer_id: userId,
                customer_name: user.name,
                customer_email: user.email, 
                customer_phone: "0"+user.phone
            },
            order_meta: {
                return_url: `${process.env.FRONTEND_URL}/u/payment-success?order_id={order_id}`
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
        const { orderId ,totalAmount} = req.body;
        var payUser=null;
        // Initialize Cashfree SDK
        const environment = process.env.PROD === 'true' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX;
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

                // Log entry for payment
                await User.findByIdAndUpdate(order.userId, { $push: { logs: { message: `Order ${order._id} paid`, createdAt: new Date() } } });

                // Email user about payment
                payUser = await User.findById(order.userId);
                
                const monthIndex = new Date().getMonth(); // 0 = Jan, 1 = Feb, ... 11 = Dec
                    await Vendor.findByIdAndUpdate(order.vendorId, {
                    $inc: { [`collection.${monthIndex}`]: order.totalPrice }
                });
                
                // Add the order to the corresponding vendor's orders array
                await Vendor.findByIdAndUpdate(order.vendorId, { $addToSet: { orders: order._id } });
            }
            console.log(totalAmount);
            const emailHTML = getPaymentSuccessTemplate(Number(totalAmount), orderId);
            
            if(payUser){
                    await sendEmail({
                      to: payUser.email,
                      subject: 'Payment Successful - printease',
                      html: emailHTML,
                    });
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
        const userType = req.user.type;

        let order;

        if (userType === 'vendor') {
            // Vendor attempting to update status – ensure the order belongs to this vendor
            order = await Order.findOne({ _id: orderId, vendorId: userId });
        } else {
            // Regular user – order must belong to the user
            order = await Order.findOne({ _id: orderId, userId: userId });
        }
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        // If order is completed, delete the file from Supabase
        if (status === 'completed' && order.fileUrl) {
            try {
              const url = new URL(order.fileUrl);
              const path = url.pathname;
          
              // path: /storage/v1/object/public/printease/1754331430796-YASHWANTH-MUNIKUNTLA_odf.pdf
              const [, , , , , bucketName, ...filePathParts] = path.split('/');
          
              // Join path parts and clean leading slashes
              const rawFilePath = filePathParts.join('/');
              const cleanedFilePath = rawFilePath.replace(/^\/+/, ''); // Ensure no leading slashes
          
              const { error } = await supabase.storage
                .from(bucketName)
                .remove([cleanedFilePath]);
          
              if (error) {
                console.error('❌ Error deleting file from Supabase:', error.message);
              } else {
                console.log(`✅ File deleted from Supabase: ${bucketName}/${cleanedFilePath}`);
              }
            } catch (error) {
              console.error('❌ Exception during file deletion:', error);
            }
          }
          
        if (status === 'completed') {
            const user = await User.findById(order.userId);
            const vendor = await Vendor.findById(order.vendorId);

            if (user && vendor) {
                const html = getOrderCompletedEmailHTML(user.email, vendor.email, order);

                await sendEmail({
                to: user.email,
                subject: 'Your Order Has Been Completed 🎉',
                html
                });

                console.log(`✅ Order completion email sent to ${user.email} for order ${order._id}`);
            }
        }


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

export { createOrder, getOrders, getVendorOrders, deleteOrder, createPaymentOrder, verifyPayment, updateOrderStatus };