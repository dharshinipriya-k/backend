const express = require('express')
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware')
const couponController = require('../controller/couponCtrl')
const router = express.Router()

router.post('/create', authMiddleware, isAdmin,couponController.createCoupon)
router.get('/all',authMiddleware,couponController.AllCoupons)
router.put('/update/:id',authMiddleware,isAdmin,couponController.updateCoupon)
router.delete('/:id',authMiddleware,isAdmin,couponController.deleteCoupon)

module.exports = router