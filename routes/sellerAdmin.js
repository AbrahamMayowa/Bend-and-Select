const express = require('express')
router = express.Router()

const sellerAdmin = require('../controllers/sellerAdmin')

const isAuth = require('../customMiddleware/isAuth')

const isSeller = require('../customMiddleware/onlySeller')
const {body} = require('express-validator')


// will add router filter
router.get('/homepage', isSeller.onlySeller, sellerAdmin.adminHome)

router.get('/add-product',isSeller.onlySeller, sellerAdmin.getAddProduct)

router.post('/add-product',[
    body('name', 'Provide a valid product name').isLength({min: 5}).withMessage('Product name should be at least 5 characters long').isString().trim(),
    body('category', 'Product category is required').not().isEmpty(),
    body('price', 'Price is required').not().isNumeric().withMessage('Price must be digit number'),
    body('condition', 'Product condition is required').not().isEmpty(),
    body('location', 'Provide a valid location').not().isEmpty(),
    body('description', 'Provide a detailed description of the product').not().isEmpty().isLength({min: 10}).withMessage('Product description should be at least 10 characters long')
] ,isSeller.onlySeller, sellerAdmin.postAddProduct)

router.get('/product-details/:productId',isSeller.onlySeller, sellerAdmin.productDetails)

router.get('/product-edit/:productId',isSeller.onlySeller, sellerAdmin.getProductEdit)

router.post('/product-edit',[
    body('name', 'Provide a valid product name').isLength({min: 5}).withMessage('Product name should be at least 5 characters long').isString().trim(),
    body('category', 'Product category is required').not().isEmpty(),
    body('condition', 'Product condition is required').not().isEmpty(),
    body('location', 'Provide a valid location').not().isEmpty(),
    body('description', 'Provide a detailed description of the product').not().isEmpty().isLength({min: 10}).withMessage('Product description should be at least 10 characters long')
], isSeller.onlySeller, sellerAdmin.postProductEdit)

router.post('/product-delete', isSeller.onlySeller, sellerAdmin.deleteProduct)


module.exports = router