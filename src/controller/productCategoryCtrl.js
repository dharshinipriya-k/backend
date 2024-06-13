const Category = require('../models/productCategoryModel.js')
const asyncHandler = require('express-async-handler')
const validateMongodbId = require('../utils/validateMongodbId.js')

const createCategory = asyncHandler(
    async(req,res)=>{
        try {
            const newCategory = await Category.create(req.body)
            res.json(newCategory)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const updateCategory = asyncHandler(
    async(req,res)=>{

        const {id} = req.params
        try {
            const updatedCategory = await Category.findByIdAndUpdate(id,req.body,{new:true})
            res.status(200).send({
                message: 'Product updated succesfully',
                updatedCategory
            })
        } catch (error) {
            throw new Error(error)
        }
    }
)

const deleteCategory = asyncHandler(
    async(req,res)=>{

        const {id} = req.params
        try {
            const deletedCategory = await Category.findByIdAndDelete(id,req.body)
            res.status(200).send({
                message: 'Product deleted succesfully',
                deletedCategory
            })
        } catch (error) {
            throw new Error(error)
        }
    }
)

const getAllCategory = asyncHandler(
    async(req,res)=>{
        try {
            const getCategory = await Category.find()
            res.json(getCategory)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const getCategory = asyncHandler(
    async(req,res)=>{

        const {id} = req.params
        try {
            const getCategory = await Category.findById(id)
            res.status(200).send({
                message: 'Product fetched succesfully',
                getCategory
            })
        } catch (error) {
            throw new Error(error)
        }
    }
)

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategory,
    getCategory
}