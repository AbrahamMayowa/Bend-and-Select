const router = require('express').Router()

const auth = require('../customMiddleware/isAuth')

const buyerControllers = require('../controllers/buyerAction')


router.post('/review', auth.onlyAuthentcatedUser, buyerControllers.reviewProduct)


module.exports = router