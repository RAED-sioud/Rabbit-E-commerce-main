const jwt = require('jsonwebtoken');
const User = require('../models/User');


//Middleware to protect routes
const protect = async (req, res, next)=>{
    let token;

    if( req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ){
        try {
            token = req.headers.authorization.split(' ')[1];
            //Verify token
            const decoded = jwt.verify(token , process.env.JWT_SECRET);

            req.user = await User.findById(decoded.user.id).select('-password'); //Exlude password
            next();
        } catch (error) {
            console.log(error);
            res.status(401).json({message: 'Not authorized , token failed'});
        }

    }else{
        res.status(401).json({message: "Not authorized , no token provided"})
    }
};


const admin = async(req, res , next) => {
    if(req.user && req.user.role === 'admin' ){
        next();
    }else{
        res.status(401).json({message: "Not authorized , not Admin "})
    }
}

module.exports = {protect , admin}