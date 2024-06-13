const Coupon = require('../models/couponModel')
const validateMongoDbId = require('../utils/validateMongodbId')
const asyncHandler = require('express-async-handler')

const createCoupon = asyncHandler(
    async(req,res)=>{
        try {
            const newCoupon = await Coupon.create(req.body)
            res.json(newCoupon)
        } catch (error) {
            throw new Error
            (error)
        }
    }
)

const AllCoupons = asyncHandler(
    async(req,res)=>{
        try {
            const coupons = await Coupon.find()
            res.status(200).send({
                message: 'Coupons fetched successfully!',
                coupons
            })
        } catch (error) {
            throw new Error(error)
        }
    }
)

const updateCoupon = asyncHandler(
    async(req,res)=>{
        const {id} = req.params
        validateMongoDbId(id)
        try {
            const coupon = await Coupon.findByIdAndUpdate(id,req.body,{new:true})

            res.status(200).send({
                message:'updated succesfully',
                coupon
            })
        } catch (error) {
            throw new Error(error)
        }
    }

)

const deleteCoupon = asyncHandler(
    async(req,res)=>{
        const {id} = req.params
        validateMongoDbId(id)
        try {
            const coupon = await Coupon.findByIdAndDelete(id)

            res.status(200).send({
                message:'Coupon deleted succesfully',
                
            })
        } catch (error) {
            throw new Error(error)
        }
    }
)

module.exports = {
    createCoupon,
    AllCoupons,
    updateCoupon,
    deleteCoupon
}