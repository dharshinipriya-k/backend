const express = require('express')
const router = express.Router()
const categoryController = require('../controller/productCategoryCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

router.post('/add', authMiddleware, isAdmin, categoryController.createCategory)
router.put('/update/:id', authMiddleware, isAdmin, categoryController.updateCategory)

router.get('/all', categoryController.getAllCategory)
router.get('/:id', categoryController.getCategory)

router.delete('/delete/:id', authMiddleware, isAdmin, categoryController.deleteCategory)

module.exports = router