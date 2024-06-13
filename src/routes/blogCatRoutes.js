const express = require('express')
const router = express.Router()
const blogCategory = require('../controller/blogCatCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

router.post('/add', authMiddleware, isAdmin,blogCategory.createCategory)
router.put('/update/:id', authMiddleware, isAdmin, blogCategory.updateCategory)

router.get('/all', blogCategory.getAllCategory)
router.get('/:id', blogCategory.getCategory)

router.delete('/delete/:id', authMiddleware, isAdmin, blogCategory.deleteCategory)

module.exports = router