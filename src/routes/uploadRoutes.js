const express = require('express')
const uploadController = require('../controller/uploadCtrl')
const {isAdmin,authMiddleware} = require('../middlewares/authMiddleware')
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImage')

const router = express.Router()

router.post(
  "/",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadController.uploadImages
);

router.delete('/delete-img/:id', authMiddleware, isAdmin,uploadController.deleteImages)
 

module.exports = router