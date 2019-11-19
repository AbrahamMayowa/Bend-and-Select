const auth = require('../controllers/auth')
const router = require('express').Router()

const onlyAuth = require('../customMiddleware/isAuth')


router.get('/signup/seller', auth.getSellerSignUp)

router.post('/signup/seller', auth.sellerSignUp)

router.get('/signup/buyer', auth.getBuyerSignUp)

router.post('/signup/buyer', auth.buyerSignUp)

router.get('/login/buyer', auth.getBuyerLogin)

router.post('/login/buyer', auth.postBuyerLogin)

router.get('/login/seller', auth.getSellerLogin)

router.post('/login/seller', auth.postSellerLogin)

router.post('/logout', onlyAuth.onlyAuthentcatedUser, auth.logOut)


module.exports = router