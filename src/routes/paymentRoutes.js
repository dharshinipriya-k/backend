const paypalController = require('../controller/paymentCtrl.js')
const express = require('express')
const  router = express.Router()

router.post("/api/orders",paypalController.checkout)
router.post('/api/orders/:orderID/capture',paypalController.payment)



module.exports = router
