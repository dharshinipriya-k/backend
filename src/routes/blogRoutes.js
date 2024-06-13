const express = require('express')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')
const blogController = require('../controller/blogCtrl')
const { route } = require('./authRoutes')
const router = express.Router()
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImage')

router.post('/create-blog',authMiddleware,isAdmin,blogController.createBlog)
router.put('/edit-blog/:id',authMiddleware,isAdmin,blogController.updateBlog)
router.put('/likes',authMiddleware,blogController.likeBlog)
router.put('/dislikes',authMiddleware,blogController.dislikeBlog)
router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array('images',10), productImgResize, blogController.uploadImages)

router.get('/all-blogs',blogController.getAllBlogs)
router.get('/get-blog/:id',blogController.getBlogByID)

router.delete('/:id',authMiddleware,isAdmin,blogController.deleteBlog)

module.exports = router