const express = require('express')
const router = express.Router()
const userController = require('../controller/user.js')
const paymentController = require('../controller/paymentCtrl.js')
const {authMiddleware,isAdmin   } = require('../middlewares/authMiddleware')

// wishlist
router.get('/wishlist', authMiddleware,userController.getWishlist)

// cart
router.get('/cart', authMiddleware,userController.getUserCart)
router.delete('/delete-cart/:cartItemId', authMiddleware,userController.removeProdFromCart)
router.delete('/empty-cart',authMiddleware,userController.emptyCart)
router.delete('/update-prod-cart/:cartItemId/:newQuantity',authMiddleware,userController.updateQuantityInCart)
router.post('/cart/apply-coupon', authMiddleware, userController.applyCoupon)

router.post('/register',userController.createUser)
router.post('/login',userController.login)
router.post('/logout',userController.logout)
router.post('/forgot-password',userController.forgotPasswordToken)
router.put('/reset-password/:token',userController.resetPassword)
router.post('/cart',authMiddleware,userController.userCart)

// Orders
router.post('/cart/create-order', authMiddleware, userController.createOrder)
router.get('/get-my-orders', authMiddleware, userController.getMyOrders)

router.get('/admin/get-orders', authMiddleware, userController.getOrders)
router.put('/update-order/:id', authMiddleware, isAdmin, userController.updateOrderStatus)

// Admin Login
router.post('/admin-login', userController.loginAdmin)

router.get('/all-users',userController.getAllUsers)
router.get('/:id',authMiddleware,isAdmin,userController.getSingleUser)

router.delete('/:id',userController.deleteUser)

router.put('/update-password',authMiddleware,userController.updatePassword)
router.put('/refresh',userController.handleRefreshToken)
router.put('/edit',authMiddleware,userController.updateUser)
router.put('/save-address',authMiddleware,userController.saveAddress)

router.put('/block-user/:id',authMiddleware,isAdmin,userController.blockUser)
router.put('/unblock-user/:id',authMiddleware,isAdmin,userController.unblockUser)   


module.exports = router