const express = require('express')
const productController = require('../controller/productCtrl')
const {isAdmin,authMiddleware} = require('../middlewares/authMiddleware')
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImage')
const router = express.Router()

router.post('/create',isAdmin,authMiddleware,productController.createProduct)

router.get('/:id',productController.getProductById)
router.get('/',productController.getAllProducts)
router.put('/rating',authMiddleware, productController.rating)

router.put('/wishlist', productController.addToWishlist)
router.put('/:id',isAdmin,authMiddleware,productController.updateProduct)

router.delete('/:id',isAdmin,authMiddleware,productController.deleteProduct)

module.exports = router

