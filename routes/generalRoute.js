const express = require('express')

const router = express.Router()

const generalControllers = require('../controllers/generalController')

router.get('/:page', generalControllers.goodsLists)

router.get('/product-details/:productId', generalControllers.productDetails)

module.exports = router