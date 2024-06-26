const Enquiry = require('../models/enquiryModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbId')

const createEnquiry = asyncHandler(
    async(req,res)=>{
        try {
            const newEnquiry = await Enquiry.create(req.body)
            res.json(newEnquiry)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const updateEnquiry = asyncHandler(
    async(req,res)=>{

        const {id} = req.params
        validateMongoDbId(id)
        try {
            const updatedEnquiry = await Enquiry.findByIdAndDelete(id, req.body,{new: true})
            res.json(updatedEnquiry)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const getAllEnquiry = asyncHandler(
    async(req,res)=>{
        try {
            const allEnquiry = await Enquiry.find()
            res.json(allEnquiry)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const getEnquiry = asyncHandler(
    async(req,res)=>{
        const {id} = req.params
        validateMongoDbId(id)
        try {
            const getEnquiry = await Enquiry.findById(id)
            res.json(getEnquiry)
        } catch (error) {
            throw new Error(error)
        }
    }
)




module.exports = {
    createEnquiry,
    updateEnquiry,
    getAllEnquiry,
    getEnquiry
}