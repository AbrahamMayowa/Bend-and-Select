const router = require('express').Router()

const search = require('../controllers/search')

router.get('/search/:page', search.searchQuery)

module.exports = router