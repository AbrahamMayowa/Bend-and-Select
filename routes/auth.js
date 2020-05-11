const auth = require('../controllers/auth')
const express = require('express')
const bcrypt = require('bcryptjs')

const router = express.Router()

const {body} = require('express-validator')


const Seller = require('../models/seller')
const Buyer = require('../models/buyer')

const onlyAuth = require('../customMiddleware/isAuth')



router.get('/signup/seller',auth.getSellerSignUp)

router.get('/signup', auth.generalSignUpPage)

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

router.get('/login', auth.getLogin)



router.post('/login/buyer',[
    body('email', 'Provide a valid email' ).trim().isEmail(),
], auth.postBuyerLogin)




router.post('/login/seller', [
    body('email', 'Provide a valid email').trim().isEmail(),
], auth.postSellerLogin)




router.post('/logout', onlyAuth.onlyAuthentcatedUser, auth.logOut)


router.get('/reset-password/:userStatus', auth.getResetPassword)


router.post('/reset-confirm',auth.postGetResetPassword)


router.get('/reset/:token/:userStatus', auth.getNewPassword)

router.post('/new-password',  [
    body('password').custom((value, {req}) =>{
        if(value ==! req.body.password2){
            throw new Error('Password and confirm password do not match')
        }
        return true
    })
], auth.postNewPassword)


router.get('/password-reset-fail', auth.passwordFail)

router.get('/passoword-reset-success', auth.passwordSuccess),

router.get('/password-reset-response', auth.passwordResetResponse)


module.exports = router