const express = require('express')

const router = express.Router()

const generalControllers = require('../controllers/generalController')
const search = require('../controllers/search')

router.get('/search/:page', search.searchQuery)

router.get('/:page', generalControllers.goodsLists)

router.get('/product/:productId', generalControllers.productDetails)

module.exports = router