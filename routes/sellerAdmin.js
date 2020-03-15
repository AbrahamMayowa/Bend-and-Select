const express = require('express')
router = express.Router()

const sellerAdmin = require('../controllers/sellerAdmin')


const isSeller = require('../customMiddleware/onlySeller')
const {body} = require('express-validator')


// will add router filter
router.get('/homepage', isSeller.onlySeller, sellerAdmin.adminHome)

router.get('/add-product',isSeller.onlySeller, sellerAdmin.getAddProduct)

router.post('/add-product',[
    body('name', 'Provide a valid product name').isLength({min: 5})
    .withMessage('Product name should be at least 5 characters long')
    .isString().trim().isLength({max: 30}).withMessage('Product name 30 characters max'),
    body('price').not().isEmpty().withMessage('Product price is required'),
    body('category', 'Product category is required').not().isEmpty(),
    body('condition', 'Product condition is required').not().isEmpty(),
    body('location', 'Provide a valid location').not().isEmpty(),
    body('description', 'Provide a detailed description of the product').not()
    .isEmpty().isLength({min: 15}).withMessage('Product description should be at least 15 characters long')
] ,isSeller.onlySeller, sellerAdmin.postAddProduct)



router.get('/product-edit/:productId',isSeller.onlySeller, sellerAdmin.getProductEdit)

router.post('/product-edit',[
    body('name', 'Provide a valid product name').isLength({min: 5})
    .withMessage('Product name should be at least 5 characters long').isString().trim(),
    body('price', 'Provide a valid price figure').notEmpty(),
    body('category', 'Product category is required').not().isEmpty(),
    body('condition', 'Product condition is required').not().isEmpty(),
    body('location', 'Provide a valid location').not().isEmpty(),
    body('description', 'Provide a detailed description of the product').not().isEmpty().isLength({min: 15}).withMessage('Product description should be at least 15 characters long')
], isSeller.onlySeller, sellerAdmin.postProductEdit)

router.post('/product-delete', isSeller.onlySeller, sellerAdmin.deleteProduct)


module.exports = router