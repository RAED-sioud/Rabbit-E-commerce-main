const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const products = require("./data/products")
const orders = require("./data/orders")

dotenv.config();

//Connect to MangoDB
mongoose.connect(process.env.MONGO_URI);

//Function to seed data 
const seedData = async() => {
    try {
        //Delete existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();
        await Order.deleteMany();

        //Create a default admin
        const createAdmin = await User.create({
            name : "Admin",
            email: "admin@exple.com",
            password: "123456",
            role: "admin"
        });

        //Assign the default Id admin to each product
        const userID = createAdmin._id

        const sampleProduct = products.map((product) => {
            return {...product ,  user: userID }
        })

        //insert data 
        await Product.insertMany(sampleProduct)
        console.log("Product data seeded successfully")
        process.exit();
    } catch (error) {
        console.error( "Error seeding the data" , error );
        process.exit(1);
    }
}

seedData();