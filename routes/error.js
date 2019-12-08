const express = require('express')

const error = require('../controllers/error')

const router = express.Router()



router.get('/401', error.error401)

module.exports = router