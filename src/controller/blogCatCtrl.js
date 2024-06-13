const blogCategory = require('../models/blogCatModel.js')
const asyncHandler = require('express-async-handler')
const validateMongodbId = require('../utils/validateMongodbId.js')

const createCategory = asyncHandler(
    async(req,res)=>{
        try {
            const newCategory = await blogCategory.create(req.body)
            res.json(newCategory)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const updateCategory = asyncHandler(
    async(req,res)=>{

        const {id} = req.params
        validateMongodbId(id)
        try {
            const updatedCategory = await blogCategory.findByIdAndUpdate(id,req.body,{new:true})
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
        validateMongodbId(id)
        try {
            const deletedCategory = await blogCategory.findByIdAndDelete(id,req.body)
            res.status(200).send({
                message: 'Product deleted succesfully'
            })
        } catch (error) {
            throw new Error(error)
        }
    }
)

const getAllCategory = asyncHandler(
    async(req,res)=>{
        try {
            const getCategory = await blogCategory.find()
            res.json(getCategory)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const getCategory = asyncHandler(
    async(req,res)=>{

        const {id} = req.params
        validateMongodbId(id)
        try {
            const getCategory = await blogCategory.findById(id)
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