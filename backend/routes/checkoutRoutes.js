const express = require('express');
const Checkout = require('../models/Checkout');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const {protect} = require("../middleware/authMiddleware");

const router = express.Router();

//@route POST /api/checkout
//@desc Create a new checkout session 
//@acces Private
router.post("/" , protect , async(req , res) =>{
    const {checkoutItems , shippingAddress, paymentMethod , totalPrice} = req.body;

    if(!checkoutItems || checkoutItems.length === 0){
        return res.status(400).json({message: "no items in checkout"});
    }

    try {
        //Create a new checkout session
        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems: checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "pending",
            isPaid: false,
        });
        console.log(`Checkout created for user : ${req.user._id}`)
        res.status(201).json(newCheckout)
    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
});

//@route PUT /api/checkout/:id/pay
//@desc Update the checkout to mark as paid after successful payment
//@acces Private
router.put("/:id/pay", protect , async(req , res) =>{
    const {paymentStatus , paymentDetails} = req.body;

    try {
        const checkout = await Checkout.findById(req.params.id);

        if(!checkout){
            res.status(404).json({message: "Checkout not found"})
        }
        if(paymentStatus === "paid"){
            checkout.isPaid = true;
            checkout.paymentStatus = paymentStatus;
            checkout.paymentDetails = paymentDetails;
            checkout.paidAt = Date.now();
            await checkout.save()

            res.status(200).json(checkout);
        }else{
            res.status(400).json({message: "Invalid Payment Status"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
});

//@route POST /api/checkout/:id/finalize
//@desc Finalize the checkout and convert to an order after payment confirmation
//@acces Private
router.post("/:id/finalize" , protect , async(req , res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);

        if(!checkout){
            res.status(404).json({message: "Checkout not found"})
        }

        const isCashOnDelivery = checkout.paymentMethod === "Cash on Delivery";
        if((checkout.isPaid || isCashOnDelivery) && !checkout.isFinalized){
            //Create final order based on the checkout details
            const finalOrder = await Order.create({
                user : checkout.user,
                orderItems: checkout.checkoutItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: checkout.isPaid,
                paidAt: checkout.paidAt,
                paymentDetails: checkout.paymentDetails,
                isDelivered: false,
                paymentStatus: checkout.isPaid ? "paid" : "pending"

            });

            //Mark the checkout as finalized
            checkout.isFinalized = true;
            checkout.fanilazedAt = Date.now();

            await checkout.save();

            //Delete the cart associated with user
            await Cart.findOneAndDelete({user: checkout.user});
            res.status(201).json(finalOrder)
        }else if (checkout.isFinalized){
            res.status(400).json({message: "Checkout already finalized"})
        }else{
            res.status(400).json({message : "Checkout is not paid"})
        }

    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
})

module.exports = router
