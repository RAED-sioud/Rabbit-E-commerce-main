const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

//@route POST /api/products
//@desc Create a new product
//@acces Private/Admin

router.post("/" , protect , admin , async(req , res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
        } = req.body;

        const product = new Product({
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            user: req.user._id,  // Reference to the admin user who created it
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
});

//@route PUT /api/products/:id
//@desc Update an existing product id
//@acces Private/Admin

router.put('/:id' , protect , admin , async(req , res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
        } = req.body;

        // Find Product by ID
        const product = await Product.findById(req.params.id)

        if(product){
            const normalizeImages = (value) => {
                if (!value) return [];
                if (Array.isArray(value)) {
                    return value
                        .map((img) => {
                            if (typeof img === 'string') return { url: img };
                            return img;
                        })
                        .filter((img) => img && typeof img.url === 'string' && img.url.trim().length > 0);
                }
                return [];
            };

            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice = discountPrice || product.discountPrice;
            product.countInStock = countInStock || product.countInStock;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.sizes = sizes || product.sizes;
            product.colors = colors || product.colors;
            product.collections = collections || product.collections;
            product.material = material || product.material;
            product.gender = gender || product.gender;
            if (images !== undefined) {
                product.images = normalizeImages(images);
            }
            product.isFeatured =
             isFeatured !== undefined ? isFeatured : product.isFeatured;
            product.isPublished =
             isPublished !== undefined ? isPublished : product.isPublished;
            product.tags = tags || product.tags;
            product.dimensions = dimensions || product.dimensions;
            product.weight = weight || product.weight;
            product.sku = sku || product.sku;
            // Save the updated product 

            const updatedproduct = await product.save();
            res.json({updatedproduct})
        }else{
            res.status(404).json({message: "Product not Found"})
        }
    } catch (error) {
        console.log(error)
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).send("Server Error")
    }
});

//@route DELETE /api/products/:id
//@desc DELETE an existing product id
//@acces Private/Admin

router.delete("/:id" , protect , admin , async(req , res) => {
    try {
        //Find product by ID
        const product = await Product.findById(req.params.id)
        if(product){
            await product.deleteOne();
            res.json({message: "Product deleted"})
        }else{
            res.status(404).json({message: "Product not Found"})
        }

    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
});

//@route GET /api/products
//@desc GET all product with optional filters
//@acces Public

router.get("/" , async(req , res) => {
    try {
        const { 
            collection,
            size,
            color,
            gender,
            minPrice,
            maxPrice,
            sortBy,
            search,
            category,
            material,
            brand,
            limit 
        } = req.query;

        let query = {};

        //Filter logic
        if(collection && collection.toLocaleLowerCase() !== "all"){
            query.collections = collection;
        }

        if(category && category.toLocaleLowerCase() !== "all"){
            query.category = category;
        }

        if(material){
            query.material = {$in: material.split(",")};
        }

        if(brand){
            query.brand = {$in: brand.split(",")};
        }

        if(size){
            query.sizes = {$in: size.split(",")};
        }

        if(color){
            query.colors = {$in: [color] };
        }

        if(gender){
            query.gender = gender;
        }

        if(minPrice || maxPrice){
            query.price = {};
            if(minPrice) query.price.$gte = Number(minPrice);
            if(maxPrice) query.price.$lte = Number(maxPrice);
        }

        if(search){
            query.$or = [
                {name: {$regex: search, $options: "i"} },
                {description: {$regex: search, $options: "i"} },
            ]
        }

        //Sort Logic
        let sort = {}
        if(sortBy) {
            switch (sortBy) {
                case "priceAsc":
                    sort = {price: 1};
                    break
                case "priceDesc":
                    sort = {price: -1};
                    break
                case "popularity":
                    sort = {rating: -1}
                    break
                default:
                    break
            }
        }
        
        //Fetch products and apply sorting and limit
        let products = await Product.find(query).sort(sort).limit(Number(limit) || 0);
        res.json(products)
    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
});

//@route GET /api/products/:best-seller
//@desc Retrieve the product with highest rating 
//@acces Public

router.get("/best-seller" , async(req , res) => {
    try {
        const bestSeller = await Product.findOne().sort({rating: -1});
        if(bestSeller){
            res.json({bestSeller})
        }else{
            res.status(404).json({message: "Best seller not found"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
})

//@route GET /api/products/new-arrivals
//@desc Retrieve latest 8  products - Creation date 
//@acces Public

router.get("/new-arrivals" , async(req , res)=>{
    try {
        //Fetch latest 8 products
        const newArrivals = await Product.find().sort({createdAt: -1}).limit(8);
    
        if(newArrivals){
            res.json({newArrivals})
        }else{
            res.status(404).json({message: "New Arrivals not found"})
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }

});

// @route GET /api/products/similar/:id (must be before /:id)
// @desc Retrieve similar products by gender and category
router.get("/similar/:id", async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const similarProducts = await Product.find({
            _id: { $ne: id },
            gender: product.gender,
            category: product.category,
        }).limit(4);
        res.json(similarProducts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route GET /api/products/:id
// @desc GET a single product by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }
        const product = await Product.findById(id);
        if (product) {
            return res.json(product);
        }
        res.status(404).json({ message: "Product not found" });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(404).json({ message: "Product not found" });
        }
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
