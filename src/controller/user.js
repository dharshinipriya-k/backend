const User = require('../models/userModel.js')
const Cart = require('../models/cartModel.js')
const Product = require('../models/ProductModel.js')
const Order = require('../models/orderModel.js')
const Coupon = require('../models/couponModel.js')
const asyncHandler = require('express-async-handler')
const jsonwebtoken = require('jsonwebtoken')
const jwt = require('../config/jwtToken.js')
const validateMongodbId = require('../utils/validateMongodbId.js')
const {generateRefreshToken} = require('../config/refreshToken.js')
const {sendEmail} = require('./emailCtrl.js')   
const crypto = require('crypto')
const uniqid = require('uniqid')
const { send } = require('process')

const createUser = asyncHandler(
    async(req,res)=>{
            //check if user already exists using email
        const user = await User.findOne({email:req.body.email})
    
        if(!user){
    
            //create new user
           
            const newUser = User.create(req.body)
           
            res.status(200).send({
                message: 'User created successfully'
                
            })
        }
    
        else{
            throw new Error(`User with ${req.body.email} already exists..Please login to continue`)
        }
    
        
        
    }
)

const login = asyncHandler(
    async(req,res)=>{

        const {email,password} = req.body
        
        try {
             // first check if user is found
            const findUser = await User.findOne({email})
            console.log(findUser);
            if(findUser)
            {
                if(await findUser.isPasswordMatched(password)){

                    // generate Refresh Token
                    const refreshToken = await generateRefreshToken(findUser?._id)
                    const updateUser = await User.findOneAndUpdate(findUser._id, 
                        {
                            refreshToken : refreshToken
                        },
                        {
                            new:true
                        }
                        )
        
                    res.cookie('refreshToken',refreshToken,{
                        httpOnly: true,
                        maxAge: 72*60*60*1000
                    })
                   
                    //  Generate a token
                    const token = await jwt.generateToken({
                        firstName: findUser.firstName,
                        role:findUser?.role,
                        id: findUser?._id,                     
                        lastName: findUser?.lastName,
                        email: findUser?.email,
                        mobile: findUser?.mobile
                    })
                    res.json({
                        message:"Login successfull",
                        token: token,
                        id: findUser?._id,
                        email: findUser?.email,
                        firstName: findUser?.firstName,
                        lastName: findUser?.lastName,
                        mobile: findUser?.mobile
                    })
                
        
                }
                else if(!findUser) {
                    throw new Error(`User not found ! Please signup to continue!`)
                }

                else{
                    throw new Error('Invalid credentials')
                }
            }
            else{
                throw new Error('User not found! Please register')
            }
        }
        catch (error) {
            console.log('showing error from login catch');
            throw new Error(error)
            
        }
           
    } 
)

// Admin login
const loginAdmin = asyncHandler(
    async(req,res)=>{

        const {email,password} = req.body
        
        try {
             // first check if Admin is found
            const findAdmin = await User.findOne({email})
            
            if(findAdmin.role !== 'admin') throw new Error('Not authorised!')
            if(findAdmin)
            {
                if(await findAdmin.isPasswordMatched(password)){

                    // generate Refresh Token
                    const refreshToken = await generateRefreshToken(findAdmin?._id)
                    const updateUser = await User.findOneAndUpdate(findAdmin._id, 
                        {
                            refreshToken : refreshToken
                        },
                        {
                            new:true
                        }
                        )
        
                    res.cookie('refreshToken',refreshToken,{
                        httpOnly: true,
                        maxAge: 72*60*60*1000
                    })
                   
                    //  Generate a token
                    const token = await jwt.generateToken({
                        firstName: findAdmin?.firstName,
                        role:findAdmin?.role,
                        id: findAdmin?._id,                     
                        lastName: findAdmin?.lastName,
                        email: findAdmin?.email,
                        mobile: findAdmin?.mobile
                    })
                    res.json({
                        message:"Login successfull",
                        token: token,
                        email: findAdmin?.email
                    })
                
        
                }
                else{
                    throw new Error(`Invalid Credentials`)
                }
            }
            else{
                throw new Error('User not found! Please register')
            }
        }
        catch (error) {
            throw new Error(error)
        }
           
    } 
)

const getAllUsers = asyncHandler(
    async(req,res)=>{
        try {
            
            // const projection = {  _id:1, firstName:1,lastName:1, email: 1, mobile: 1, password:0}
            const getUsers = await User.find()  
            res.json(getUsers)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const getSingleUser = asyncHandler(
    async(req,res)=>{
        try {
            const {_id} = req.user
            validateMongodbId(_id)
            const getUser = await User.findOne({_id:_id})
            res.status(200).send({
                message: 'Data fetched successfully',
                getUser
            })
        } catch (error) {
            throw new Error(error)
        }
    }
)   

const deleteUser = asyncHandler(
    async(req,res)=>{
        const {id} = req.params
        validateMongodbId(id)
        try {
            const deleteUser = await User.deleteOne({_id:id})
            res.status(200).send({
                message: 'User deleted successfully',
                deleteUser

            })
        } catch (error) {
            res.status(500).send({
                message:'Internal server error',
                error: error.message
                
            })
        }
    }
)   

const updateUser = asyncHandler(
    async(req,res)=>{
        const {_id} = req.user
        // console.log(_id);
        validateMongodbId(_id)
        try {
            const editUser = await User.findOneAndUpdate(_id,{
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                role: req.body.role,               
                mobile: req.body.mobile
            })

            // res.status(200).send({
            //     message: 'User updated successfully',
            //    res.json editUser
               
            // })

            res.json(editUser)

        } catch (error) {
            res.status(500).send({
                message:'Internal server error',
                error: error.message
            })
        }
    }
)

const blockUser = asyncHandler(
    async(req,res)=>{
        const {id} = req.params
        validateMongodbId(id)
        try {
             const blockUser = await User.findByIdAndUpdate(id,
            {
                isBlocked: true
            },
            {
                new: true
            }
            )

            res.status(200).send({
                message: 'User blocked successfully',
                blockUser
            })
        } catch (error) {
            throw new Error(error)
        }

    }
)

const unblockUser = asyncHandler(
    async(req,res)=>{
        const {id} = req.params
        validateMongodbId(id)
        try {
            const unblockUser = await User.findByIdAndUpdate(id,
            {
                isBlocked: false
            },
            {
                new: true
            }
            )

            res.status(200).send({
                message: 'User unblocked successfully',
                unblockUser
            })
        } catch (error) {
            throw new Error(error)
        }

    }
)

//Handle refresh Token
const handleRefreshToken = asyncHandler(
    async(req,res)=>{
        const cookie = req.cookies
            // console.log(cookie);
        if(!cookie?.refreshToken) throw new Error('No refresh Token found in cookies')
        const refreshToken = cookie.refreshToken
            //  console.log('refreshtoken: ',refreshToken);
        const user =  await User.findOne({refreshToken})

            // console.log(user.id);
        if(!user) throw new Error('No refresh token found in DB')

         jsonwebtoken. verify(refreshToken,process.env.JWT_SECRET, async (err,decoded)=>{
            // console.log(decoded.id);
            if(err || user.id !== decoded.id){
                throw new Error('Something wrong with refresh token')
            }

            const accessToken = await  jwt.generateToken(
                user?._id,
             )
               console.log(accessToken);

            res.status(200).send({
                message:"Access token generated",
                accessToken
            })
                    
               
            
        })
      
    }
)

const logout = asyncHandler(
    async(req,res)=>{
        const cookie = req.cookies
        // console.log(cookie?.refreshToken);
        
        if(!cookie?.refreshToken) throw new Error('No refresh token in cookies')
        const refreshToken = cookie.refreshToken

        const user = await User.findOne({refreshToken})
        // console.log(user);
        
        if(!user){
            res.clearCookie('refreshToken',{
                httpOnly: true,
                secure: true
            })
            return res.sendStatus(204) //forbidden

        }

        await User.findOneAndUpdate(user,{
            refreshToken:"",
        })

        res.clearCookie('refreshToken',{
            httpOnly: true,
            secure: true    
        })

          res.sendStatus(204)
      
    }
)

const updatePassword = asyncHandler(
    async(req,res)=>{
        const {_id} = req.user
        const {password} = req.body
        validateMongodbId(_id)
        const user = await User.findById(_id)
        // console.log(password);
        
        if(password){
            user.password = password         
            const updatePassword = await user.save()
            
            res.status(200).send({
                message:'Password updated successfully!',
                updatePassword
            })

            res.status(500).send({
                message: 'Internal server error',
                error:error.message
            })
        }
        else{
            res.json(user)
        }
    }
)   

const forgotPasswordToken = asyncHandler(
    async(req,res)=>{
        const {email} = req.body
        const user = await User.findOne({email})
        if(!user) throw new Error(`User with ${req.body.email} not found`)
        try {
            const token = await user.createPasswordResetToken()
            await user.save() 
            const resetURL = `Hi ${user.firstName}, Please click this link to reset your password. This link is valid for 10 minutes.<a href='http://localhost:5173/reset-password/${token}'>Click Here</a>`
            const data = {
                to: email,
                text: `Hi, ${user.firstName}`,
                subject: "Password Reset Link",
                htm: resetURL
            }

            sendEmail(data)
            res.status(200).send({
                message:'Email sent successfully',
                token
            })
        } catch (error) {
            throw new Error(error)
        }
    }
)

const resetPassword = asyncHandler(
    async(req,res)=>{
        const {password} = req.body
        const {token} = req.params

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: {$gt: Date.now()}
        })

        if(!user) throw new Error('Token Expired, Please try again!')
        user.password = password
        user.passwordResetToken = undefined,
        user.passwordResetExpires = undefined

        await user.save()
        res.json(user)
    }
)

// Save user address
const saveAddress = asyncHandler(
    async(req, res, next)=>{
        const {_id} = req.user
        validateMongodbId(_id)
        console.log(req.user);

        try {
            const editUser = await User.findByIdAndUpdate(_id,{
                address: req?.body?.address,
               
            },
            {
                new:true
                
            })

            res.status(200).send({
                message: 'User updated successfully',
               
            })

        } catch (error) {
            res.status(500).send({
                message:'Internal server error',
                error: error.message
            })
        
    }

    }
)
// Wishlist functionalities
const getWishlist = asyncHandler(
    async(req,res)=>{
        const {_id} = req.user
        try {
            const findUser = await User.findById(_id).populate('wishlist')
            res.json(findUser)
        } catch (error) {
            throw new Error(error)
        }
    }
)

// Cart functionalities
const  userCart = asyncHandler(
    async(req,res)=>{

        const {productId, quantity, price} = req.body
        const {_id} = req.user
        validateMongodbId(_id)
        
        try {
            
            let newCart = await new Cart({
                userId: _id,
                productId,
                price,
                quantity
            }).save()

            res.json(newCart)
            // res.status(200).send({
            //     message: 'Prod add to cart',
            //     newCart
            // })
        } catch (error) {
            throw new Error(error)
        }
    }
    
)

const getUserCart = asyncHandler(
    async(req,res)=>{
        const {_id} = req.user
        validateMongodbId(_id)

        try {
            const cart = await Cart.find({userId: _id}).
            populate('productId')
            res.json(cart)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const removeProdFromCart = asyncHandler(async(req,res) => {
        const {_id} = req.user
        const {cartItemId} = req.params
        validateMongodbId(_id)

        try {
            const deleteFromCart = await Cart.deleteOne({userId: _id, _id: cartItemId})
            res.json(deleteFromCart)
        } catch (error) {
            throw new Error(error)
        }
})

const updateQuantityInCart = asyncHandler(
    async(req,res) => {
        const {_id} = req.user
        const {cartItemId, newQuantity} = req.params
        validateMongodbId(_id)

        try {
            const updateCartItem = await Cart.findOne({userId: _id, _id: cartItemId})
            updateCartItem.quantity = newQuantity
            updateCartItem.save()
            res.json(updateCartItem)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const emptyCart = asyncHandler(
    async(req,res)=>{
        const {_id} = req.user
        // validateMongodbId(_id)

        try {
            const user = await User.findOne({_id})
            const cart = await Cart.findOneAndDelete({orderBy: user._id})
            res.status(200).send({
                message: 'Emptied cart!',
                cart
            })
        } catch (error) {
            throw new Error(error)
        }
    }
)

const applyCoupon = asyncHandler(
    async(req,res)=>{
        const {coupon} = req.body
        const {_id} = req.user
        validateMongodbId(_id)

        const validCoupon = await Coupon.findOne({name: coupon})
        if(validCoupon === null){
            throw new Error('Invalid Coupon')
        }

        const user = await User.findOne({_id})
        let {products, cartTotal} = await Cart.findOne({orderBy: user._id}).populate('products.product')
        let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount)/100).toFixed(2)

        await Cart.findOneAndUpdate({orderBy: user._id},{totalAfterDiscount},{new: true})
        res.status(200).send({
            message: 'Coupon applied!',
            totalAfterDiscount
        })
    }
)

const createOrder = asyncHandler(
    async(req,res)=>{
        const {shippingInfo, orderItems, totalPrice, paymentInfo} = req.body
        const {_id} = req.user
        validateMongodbId(_id)

        try {
            const order = await Order.create({
              shippingInfo,
              orderItems,
              totalPrice,    
              paymentInfo,
              user: _id,
            });
            res.json({
                order,
                success: true
            })
        } catch (error) {
            throw new Error(error)
        }
        

    }
)

const getMyOrders = asyncHandler(
    async(req,res) => {
        const {_id} = req.user

        try {
            const myOrders = await Order.find({user:_id}).populate('user').populate('orderItems')
// .populate('user')?.populate('orderItems.product')

            res.json({
                myOrders
            })
        } catch (error) {
            throw new Error(error)
        }

    }
)

// For Admin
const getOrders = asyncHandler(
    async(req,res)=>{
        const {_id} = req.user
        validateMongodbId(_id)

        try {
            const userOrders = await Order.find().populate('orderItems.productId')//Need to check
            
            res.json({userOrders})
        } catch (error) {
            throw new Error(error)
        }
    }
)

const updateOrderStatus = asyncHandler(
    async(req,res)=>{
        const {status} = req.body
        const {id} = req.params
        validateMongodbId(id)

        try {
            const updateStatus = await Order.findByIdAndUpdate(id,
                {
                    orderStatus: status,
                    paymentIntent:{
                        status: status,
                    }
                },
                {new:true})
            res.json(updateStatus)
        } catch (error) {
            throw new Error(error)
        }
    }
)

module.exports = {
    createUser, 
    login,
    getAllUsers,
    getSingleUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    saveAddress,
    userCart,
    getUserCart,
    emptyCart,
    createOrder,
    loginAdmin,
    getWishlist,
    applyCoupon,
    getOrders,
    updateOrderStatus,
    removeProdFromCart,
    updateQuantityInCart,

    getMyOrders
}