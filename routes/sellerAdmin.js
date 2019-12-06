const express = require('express')
router = express.Router()

const sellerAdmin = require('../controllers/sellerAdmin')

const isAuth = require('../customMiddleware/isAuth')


// will add router filter
router.get('/homepage',isAuth.onlyAuthentcatedUser, sellerAdmin.adminHome)

router.get('/add-product',isAuth.onlyAuthentcatedUser, sellerAdmin.getAddProduct)

router.post('/add-product',isAuth.onlyAuthentcatedUser, sellerAdmin.postAddProduct)

router.get('/product-details/:productId',isAuth.onlyAuthentcatedUser, sellerAdmin.productDetails)

router.get('/product-edit/:productId',isAuth.onlyAuthentcatedUser, sellerAdmin.getProductEdit)

router.post('/product-edit',isAuth.onlyAuthentcatedUser, sellerAdmin.postProductEdit)

router.post('/product-delete',isAuth.onlyAuthentcatedUser, sellerAdmin.deleteProduct)


module.exports = router