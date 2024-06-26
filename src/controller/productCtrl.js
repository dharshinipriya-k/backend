const { query } = require('express')
const Product = require('../models/ProductModel')
const User = require('../models/userModel.js')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
const validateMongoDbId = require('../utils/validateMongodbId.js')
const {cloudinaryUploadImg, cloudinaryDeleteImg} = require('../utils/cloudinaryFile.js')
const fs = require('fs')

const  createProduct = asyncHandler(
    async(req,res)=>{

        try {

            if(req.body.title){
                req.body.slug = slugify(req.body.title)
            }
            const newProduct = await Product.create(req.body)

            res.status(200).send({
                message: 'Product added Succesfully',
                newProduct
            })
        } catch (error) {
            throw new Error(error.response)
        }
        
    }
)

const   updateProduct = asyncHandler(
    async(req,res)=>{
        const {id} = req.params
        try {
            
           if(req.body.title){
            req.body.slug = slugify(req.body.title)
           } 

           const updateProduct = await Product.findByIdAndUpdate(id,req.body)

           res.status(200).send({
            message:"Product updated succesfully",
            updateProduct
           })

        } catch (error) {
            throw new Error(error)
        }
    }
)

const getProductById  = asyncHandler(
    async(req,res)=>{
        const {id} = req.params
        try {

            const findProduct = await Product.findById(id)
            res.status(200).send({
                message:"Product fetch succesfull",
                findProduct
            })
        } catch (error) {
            res.status(400).send({
                message:"PRoduct not found",
                error:error.message
            })
        }
    }
)

const getAllProducts = asyncHandler(async (req, res) => {
  try {

    // Product filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));

    let query = Product.find(JSON.parse(queryStr));

    // Sorting Product
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)

    }
    else{
        query = query.sort('-createdAt')
    }

    // Limiting the fields
    if(req.query.fields){
        const fields = req.query.fields.split(',').join(' ')
        query = query.select(fields)
    }else{
        query = query.select('-__v')
    }

    // Pagination
    const page = req.query.page
    const limit = req.query.limit
    const skip = (page-1) * limit

    query = query.skip(skip).limit(limit)
    if(req.query.page){
        const productCount = await Product.countDocuments()
        if(skip >= productCount) throw new Error('This Page does not exists')
    }
    console.log(page,limit,skip);


    const product = await query;
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProduct = asyncHandler(
    async(req,res)=>{
        const {id} = req.params
        try {

           const deleteProduct = await Product.findByIdAndDelete(id)

           res.status(200).send({
            message:"Product deleted succesfully"
            
           })

        } catch (error) {
            throw new Error(error)
        }
    }
)

const addToWishlist = asyncHandler(
    async(req,res)=>{
        const {_id} = req.user
        console.log(_id);
        const {prodId} = req.body

        try {
            const user = await User.findById(_id)
            
            const alreadyAdded = user.wishlist.find((id)=> id === prodId)
            if(alreadyAdded){
                let user = await User.findByIdAndUpdate(id,{
                    $pull: {wishlist: prodId}
                },{
                    new: true
                }
            )
                res.status(200).send({
                    message: 'Added to wishlist...!',
                    user
                })
            }
            else{
                let user = await User.findByIdAndUpdate(_id,{
                    $push: {wishlist: prodId}
                },{
                    new: true
                }
            )
                res.status(200).send({
                    message: 'Added to wishlist...!',
                    user
                })
            }
        } catch (error) {
            throw new Error(error)
        }
    }
)

const rating = asyncHandler(
    async(req,res) =>{
        const {_id} = req.user
        const {star, prodId, comment} =  req.body
        
        try {
            const product = await Product.findById(prodId)

            let alreadyRated = product.ratings.find((userId) => userId.postedBy.toString() === _id.toString())
            if(alreadyRated){
                
                const updateRating = await Product.updateOne({
                    ratings: {$elemMatch: alreadyRated},
                    
                },
                {
                    $set: {'ratings.$.star':star, 'ratings.$.comment':comment}
                },
                {
                    new: true
                }
                )
                    res.json(updateRating)
            }
            else{
                const rateProduct = await Product.findByIdAndUpdate(prodId,{
                    $push: {
                        ratings:{
                            star: star,
                            comment: comment,
                            postedBy: _id
                        }
                    }
                },
                {
                    new: true
                }
                )
                    res.json(rateProduct)
            }
            const getAllRatings = await Product.findById(prodId)
            let totalRating = getAllRatings.ratings.length
            let ratingSum = getAllRatings.ratings.map((item)=>item.star).
            reduce((prev,curr)=>prev+curr, 0)

            let actualRating = Math.round(ratingSum/totalRating)
         let finalProduct =    await Product.findByIdAndUpdate(prodId,{
                totalrating: actualRating
            }, {new: true})

            res.json(finalProduct)
             
        } catch (error) {
            throw new Error(error)
        }
    }
)

const uploadImages = asyncHandler(async(req,res)=>{

    console.log(req.files);

})

module.exports = {
    createProduct,
    getProductById,
    getAllProducts,
    updateProduct,
    deleteProduct,
    rating,
    uploadImages,
    addToWishlist
}