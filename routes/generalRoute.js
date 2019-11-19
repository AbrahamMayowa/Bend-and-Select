const express = require('express')

const router = express.Router()

const generalControllers = require('../controllers/generalController')

router.get('/', generalControllers.goodsLists)

module.exports = router
