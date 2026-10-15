const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const {protect} = require("../middleware/authMiddleware");

const router = express.Router();

//Function to get a cart by user Id or guest ID
const getCart = async(userId , guestId) => {
    if(userId){
        return await Cart.findOne({user: userId})
    }else if (guestId){
        return await Cart.findOne({guestId});
    }
    return null;
}

//@route POST /api/cart
//@desc Add a product to the cart a guest or logged in user 
//@acces Public
router.post("/", async(req , res) => {
    const {productId , quantity , size , color , guestId , userId} = req.body;
    try {
        const product = await Product.findById(productId);
        if(!product) return res.status(404).json({message: "Product not found"});

        //Determine if the user is logged in or guest
        let cart = await getCart(userId , guestId);

        const qty = Number(quantity);
        //if the cart exists update it
        if(cart) {
            const productIndex = cart.products.findIndex(
                (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
            );
            if(productIndex > -1){
                //if the product alredy exists , update the quantity
                cart.products[productIndex].quantity +=  qty;
            }else{
                const imageUrl = (product.images && product.images[0]) ? (product.images[0].url || product.images[0]) : '';
                cart.products.push({
                    productId,
                    name: product.name,
                    image: imageUrl,
                    price: product.price,
                    size,
                    color,
                    quantity: qty,
                })
            }
             //Recalculate the total price
            cart.totalPrice = cart.products.reduce(
                    (acc, item) => acc + item.price * Number(item.quantity),
            0
            )
            await cart.save();
            return res.status(200).json(cart)
        }else{
            const imageUrl = (product.images && product.images[0]) ? (product.images[0].url || product.images[0]) : '';
            const newCart = await Cart.create({
                user : userId ? userId : undefined,
                guestId : guestId ? guestId : "guest_" + new Date().getTime(),
                products: [
                    {
                        productId,
                        name: product.name,
                        image: imageUrl,
                        price: product.price,
                        size,
                        color,
                        quantity: qty,
                    },
                ],
                totalPrice: product.price * Number(quantity),
            });
            return res.status(200).json(newCart)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
})

//@route PUT /api/cart
//@desc Update product quantity in the cart for a guest or logged-in user
//@acces Public
router.put("/", async(req , res) => {
    const {productId , quantity , size , color , guestId , userId} = req.body;
    try {
        let cart = await getCart(userId , guestId)
        if (!cart) return res.status(404).json({message : "Cart not found"})
        
        const productIndex = cart.products.findIndex(
            (p) =>
            p.productId.toString() === productId &&
            p.size === size &&
            p.color === color
        );
        if(productIndex > -1) {
            //update quantity 
            if (quantity > 0){
                cart.products[productIndex].quantity = quantity;
            } else {
                cart.products.splice(productIndex, 1); // Remove product if quantity is 0
            }
            cart.totalPrice = cart.products.reduce(
               (acc, item) => acc + item.price * Number(item.quantity),
               0
            )
            await cart.save();
            return res.status(200).json(cart);

        }else{
            return res.status(404).json({message: "Product not found in cart"})
        }

    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error")       
    }
})

//@route delete /api/cart
//@desc Remove the product from he cart
//@acces Public
router.delete("/" , async(req,res) => {
    const {productId , quantity , size , color , guestId , userId} = req.body;
    try {
        let cart = await getCart(userId , guestId);
        if(!cart) return res.status(404).json({message: "Cart not found"});

        const productIndex = cart.products.findIndex(
            (p) =>
            p.productId.toString() === productId &&
            p.size === size &&
            p.color === color
        );

        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);

            cart.totalPrice = cart.products.reduce(
               (acc, item) => acc + item.price * Number(item.quantity),
               0
            )

            await cart.save()
            return res.status(200).json(cart)
        }else{
            return res.status(404).json({message: "Product not found"});
        }

    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
})

//@route GET /api/cart
//@desc Get logged-in user's or guest user's cart
//@acces Public
router.get("/", async (req, res) => {
    const { userId, guestId, guestID } = req.query;
    const guestIdParam = guestId || guestID;

    try {
        const cart = await getCart(userId, guestIdParam);
        if (cart) {
            return res.status(200).json(cart);
        }
        return res.status(200).json({ products: [], totalPrice: 0 });
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});

//@route POST /api/cart/merge
//@desc Merge guest cart into user cart on login 
//@acces Private
router.post("/merge" , protect , async(req , res) => {
    const {guestId} = req.body;
    try {
        //Find the guest cart and user cart*
        const guestCart = await Cart.findOne({guestId})
        const userCart = await Cart.findOne({user: req.user._id})

        if(guestCart){
            if(guestCart.products.length === 0 ){
                if (userCart) {
                    return res.status(200).json(userCart);
                }
                return res.status(200).json({ products: [], totalPrice: 0 });
            }
            if(userCart){
                //Merge guest cart into user cart
                guestCart.products.forEach((guestItem)=>{
                    const productIndex = userCart.products.findIndex(
                        (item) => 
                            item.productId.toString() === guestItem.productId.toString() &&
                            item.size === guestItem.size &&
                            item.color === guestItem.color
                    );
                    if (productIndex > -1){
                        //If the items exists in the user cart , update the quantity
                        userCart.products[productIndex].quantity += guestItem.quantity;
                    }else{
                        // Otherwise , add the guest item to the cart
                        userCart.products.push(guestItem)
                    }
                });
                userCart.totalPrice = userCart.products.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                );
                await userCart.save();

                //Remove the guest cart after merging
                try {
                    await Cart.findOneAndDelete({guestId});
                } catch (error) {
                    console.error("Error deleting guest cart:", error)
                }

                res.status(200).json(userCart)
            }else{
                //If the user has no existing cart , assign the guest cart to the user
                guestCart.user = req.user._id;
                guestCart.guestId = undefined;
                await guestCart.save();

                res.status(200).json(guestCart);
            }
        }else{
            if(userCart){
                //Guest cart has already been merged, return user cart
                return res.status(200).json(userCart);
            }
            return res.status(200).json({ products: [], totalPrice: 0 });
        }
    } catch (error) {
       console.log(error)
       res.status(500).send("Server Error")
    }
})



module.exports = router;
