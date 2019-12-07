const auth = require('../controllers/auth')
const express = require('express')

const router = express.Router()

const {body} = require('express-validator')


const Seller = require('../models/seller')
const Buyer = require('../models/buyer')

const onlyAuth = require('../customMiddleware/isAuth')

/*

 [
    body('name', 'The field is required and at least 3 characters').isString().isLength({min: 3}).trim(),
    body('email', 'Please, provide a valid email').isEmail().custom((value, {req})=> {
        return Seller.findOne({email: value}).then(seller =>{
            if (seller){
                return Promise.reject('Email already exist. Provide another one')
            }
        })

    }).trim().normalizeEmail(),
    body('password').isLength({min: 6}).withMessage('Provide at least 5 characters').custom(
        ((value, {req})=> {
            if(value !== req.body.password2 ){ 
                return Promise.reject('Password and Confirm Password do not match')
            }
        })).trim(),
    body('phoneNumber', 'Should be number type and at least 9 digits').isInt().isLength({min: 9}).trim()
],

[
    body('username', 'Username should be at least 3 character and not start with number').isLength({min: 3}).isString().trim(),
    body('email').isEmail().normalizeEmail().trim().custom((value, {req}) =>{
        return Buyer.findOne({email: value}).then(buyer =>{
            if(buyer){
                return Promise.reject('Email already exist. Provide another')
            }
        })
    }),
    body('password').isLength({min: 6}).withMessage('Password should be at least 6 characters').custom((value, {req})=>{
        if(value !== req.body.password2){
            return Promise.reject('Password and confirm password should match')
        }
    }),
    body('phoneNumber', 'Should be number type and at least 9 digits').isInt().isLength({min: 9}).trim()
]
*/


router.get('/signup/seller',auth.getSellerSignUp)

router.post('/signup/seller', [
    [
        body('name', 'Name is required and should be at least 3 characters').isString().isLength({min: 3}).trim(),
        body('email', 'Please, provide a valid email').isEmail().custom((value, {req})=> {
            return Seller.findOne({email: value}).then(seller =>{
                if (seller){
                    return Promise.reject('Email already exist. Provide another one')
                }
            })
    
        }).trim().normalizeEmail(),
        body('password').isLength({min: 6}).withMessage('Password field requires at least 5 characters').custom(
            ((value, {req})=> {
                if(value !== req.body.password2 ){ 
                    throw new Error('Password and confirm password should match')
                }
                return true
            })).trim(),
        body('phoneNumber', 'Phone number should be number type and at least 9 digits').isInt().isLength({min: 9}).withMessage('Phone number should contain at least 9 digits').trim()
    ],
    
], auth.sellerSignUp)

router.get('/signup/buyer', auth.getBuyerSignUp)

router.post('/signup/buyer', [
    [
        body('username', 'Username should be at least 3 character and not start with number').isLength({min: 3}).isString().withMessage('Phone number should contain at least 9 digits').trim(),
        body('email').isEmail().normalizeEmail().trim().custom((value, {req}) =>{
            return Buyer.findOne({email: value}).then(buyer =>{
                if(buyer){
                    return Promise.reject('Email already exist. Provide another')
                }
            })
        }),
        body('password').isLength({min: 6}).withMessage('Password should be at least 6 characters').custom((value, {req})=>{
            if(value !== req.body.password2){
                throw new Error('Password and confirm password should match')
            }
            return true
        }),
        body('phoneNumber', 'Should be number type and at least 8 digits').isLength({min: 8}).trim()
    ]
], auth.buyerSignUp)

router.get('/login/buyer', auth.getBuyerLogin)

router.post('/login/buyer', auth.postBuyerLogin)

router.get('/login/seller', auth.getSellerLogin)

router.post('/login/seller', auth.postSellerLogin)

router.post('/logout', onlyAuth.onlyAuthentcatedUser, auth.logOut)


module.exports = router