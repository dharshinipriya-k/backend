const Blog = require('../models/blogModel')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const validateMongodbId = require('../utils/validateMongodbId')
const cloudinaryUploadImg = require('../utils/cloudinaryFile.js')
const fs = require('fs')

const createBlog = asyncHandler(async(req,res)=>{
    try {
        const newBlog = await Blog.create(req.body)
        res.status(200).send({
            message:'Blog created successfully',
            newBlog
        })
    } catch (error) {
        throw new Error(error)
    }
})

const updateBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMongodbId(id)
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id,req.body,{new:true})
        res.status(200).send({
            message:'Blog updated successfully',
            updateBlog
        })
    } catch (error) {
        throw new Error(error)
    }
})

const getAllBlogs = asyncHandler(async(req,res)=>{
   
    try {
        const findBlogs = await Blog.find()
        res.json(findBlogs)
    } catch (error) {
        throw new Error(error)
    }
})

const getBlogByID = asyncHandler(async(req,res)=>{
   
    const {id} = req.params
    validateMongodbId(id)
    try {
        const findBlog = await Blog.findById(id).populate('likes').populate('dislikes')
        const updateViews = await Blog.findByIdAndUpdate(
            id,
            {
                $inc: {noOfViews: 1},
            },
            {
                new: true
            }
        )
        res.status(200).send({
            message:'Blogs fetched successfully',
            findBlog
        })
    } catch (error) {
        throw new Error(error)
    }
})

const deleteBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMongodbId(id)
   
    try {
        const deleteBlog = await Blog.findByIdAndDelete(id)
        res.status(200).send({
            message:'Blog deleted successfully',
            deleteBlog
        })
    } catch (error) {
        throw new Error(error)
    }
})

const likeBlog = asyncHandler(
    async(req,res)=>{
        const {blogId} = req.body
        validateMongodbId(blogId)

        // Find the blog which we want to like
        const blog = await Blog.findById(blogId)

        // Find user who is logged in
        const loginUserId = req?.user?._id

        // check if user liked the post
        const isLiked = blog?.isLiked

        // find if user disliked the post
        const alreadyDisliked = blog?.dislikes?.find(
            (userId) => userId?.toString() === loginUserId?.toString())    
        

        if(alreadyDisliked){
            const blog = await Blog.findByIdAndUpdate(blogId,{
                $pull: {dislikes: loginUserId},
                isDisliked: false
            },
            {new: true}        
    )

    res.json(blog)
        }
        if(isLiked){
            const blog = await Blog.findByIdAndUpdate(blogId,{
                $pull:{likes: loginUserId},
                isLiked: false
            },
            {new: true}        
    )

    res.json(blog)
        }
else{
    const blog = await Blog.findByIdAndUpdate(blogId,{
        $push:{likes: loginUserId},
        isLiked: true
    },
    {new: true}        
)

res.json(blog)
}
    }
)

const dislikeBlog = asyncHandler(
    async(req,res)=>{
        const {blogId} = req.body
        validateMongodbId(blogId)

        // Find the blog which we want to like
        const blog = await Blog.findById(blogId)

        // Find user who is logged in
        const loginUserId = req?.user?._id

        // check if user liked the post
        const isDisliked = blog?.isDisliked

        // find if user disliked the post
        const alreadyLiked = blog?.likes?.find(
            (userId) => userId?.toString() === loginUserId?.toString())    
        

        if(alreadyLiked){
            const blog = await Blog.findByIdAndUpdate(blogId,{
                $pull: {likes: loginUserId},
                isLiked: false
            },
            {new: true}        
    )

    res.json(blog)
        }
        if(isDisliked){
            const blog = await Blog.findByIdAndUpdate(blogId,{
                $pull:{dislikes: loginUserId},
                isDisliked: false
            },
            {new: true}        
    )

    res.json(blog)
        }
else{
    const blog = await Blog.findByIdAndUpdate(blogId,{
        $push:{dislikes: loginUserId},
        isDisliked: true
    },
    {new: true}        
)

res.json(blog)
}
    }
)

const uploadImages = asyncHandler(async(req,res)=>{
    // console.log(req.files)
    const {id} = req.params
    validateMongoDbId(id)
    console.log(req.file);

    try {
        
        const uploaded = (path)=> cloudinaryUploadImg(path,'images')
        const urls = []
        const files = req.file
        for(const file of files){
            const {path} = file
            const newpath = await uploader(path)
            urls.push(newpath)
            fs.unlinkSync(path)

        }
        const findBlog = await Blog.findByIdAndUpdate(id,{
            images: urls.map((file)=>{
                return file
            }),
        },
        {
            new: true
        })

        res.json(findBlog)
    } catch (error) {
        // throw new Error(error)
        res.status(500).send({
            error: error.message
        })
    }
})


module.exports = {
    createBlog,
    updateBlog,
    getAllBlogs,
    getBlogByID,
    deleteBlog,
    likeBlog,
    dislikeBlog,
    uploadImages
}