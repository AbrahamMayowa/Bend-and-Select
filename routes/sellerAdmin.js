const router = require('express').Router()

const sellerAdmin = require('../controllers/sellerAdmin')

const isAuth = require('../customMiddleware/isAuth')


// will add router filter
router.get('/homepage', isAuth.onlyAuthentcatedUser, sellerAdmin.adminHome)

router.get('/add-product', isAuth.onlyAuthentcatedUser, sellerAdmin.getAddProduct)

router.post('/add-product', isAuth.onlyAuthentcatedUser, sellerAdmin.postAddProduct)

router.get('/product-details', isAuth.onlyAuthentcatedUser, sellerAdmin.productDetails)

router.get('/product-edit', isAuth.onlyAuthentcatedUser, sellerAdmin.getProductEdit)

router.post('/product-edit', isAuth.onlyAuthentcatedUser, sellerAdmin.getProductEdit)


module.exports = router