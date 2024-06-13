const express = require('express')
const router = express.Router()
const enqController = require('../controller/enquiryCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

router.post('/create', enqController.createEnquiry  )
router.get('/all', enqController.getAllEnquiry)
router.get('/:id', authMiddleware, isAdmin, enqController.getEnquiry)
router.put('/update/:id', authMiddleware, isAdmin, enqController.updateEnquiry)
module.exports = router