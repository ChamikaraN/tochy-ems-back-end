import asyncHandler from 'express-async-handler'
import Order from '../Models/orderModel.js'

export const createOrder= ('/', asyncHandler(async (req, res)=>{
    const {
      billingDetails,
      products,
      paymentDetails
    } = req.body;
    
    const order = new Order({
       user: req.user._id,
        billingDetails,
        products,
        paymentDetails,
        isPaid: true,
        
      })
  
    const orderDone= await order.save()

    if (orderDone) {
        res.json(orderDone)
        
    }
    else {
        res.status(404)
        throw new Error('Problem with creating order')
    }


}))


/// get order by id
export const getOrderById = ('/:id', asyncHandler(async (req, res)=>{
  
  const order = await Order.findById(req.params.id).populate('user', 'name email')
    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order Details not found...");
    }
}))


/// get orders by user id
export const getOrders = ('/', asyncHandler(async (req, res)=>{

  const orders = await Order.find()
    if (orders) {
      res.json(orders);
    } else {
      res.status(404);
      throw new Error("Order History not found...");
    }
}))

/// update delivery, update payment : change ispaid true & isDelivered true
export const updateOrder = ('update/:id', asyncHandler(async (req, res)=>{

  
  
  const updateDone = await Order.findOneAndUpdate({_id:req.params.id}, req.body, {
    new: true
  })
    if (updateDone) {
      res.json({success: true});
    } else {
      res.status(404);
      throw new Error("Order Details not found...");
    }
}))

/// make payment : change ispaid true
export const makePayment = ('/:orderId', asyncHandler(async (req, res)=>{

  
  
  const updatePayment = await Order.findOneAndUpdate({_id:req.params.orderId}, {isPaid:true}, {
    new: true
  })
    if (updatePayment.isPaid) {
      res.json(updatePayment.isPaid);
    } else {
      res.status(404);
      throw new Error("Order Details not found...");
    }
}))