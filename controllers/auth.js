const Buyer = require('../models/buyer')

const Seller = require('../models/seller')

const bcrypt = require('bcryptjs')

const crypto = require('crypto')



const {validationResult} = require('express-validator')
const imageDelete = require('../utils/deleteImage')



exports.getSellerSignUp = (req, res, next) => {
    res.render('auth/sellerSignUp', {
    pageTitle: 'Sign Up',
    errorMessage: ''
})
}

exports.generalSignUpPage = (req, res, next)=>{
    res.status(200).render('auth/generalSignUp', {
        pageTitle: 'Sign Up',
        errorMessage: ''
    })
}


exports.getBuyerSignUp = (req, res, next) => {
    res.render('auth/buyerSignUp', {
        pageTitle: 'Sign Up',
        errorMessage: ''
    })
}


exports.buyerSignUp = (req, res, next) => {
    const email = req.body.email
    const phoneNumber = req.body.phoneNumber
    const image = req.file
    const username = req.body.username
    const password = req.body.password


    const error = validationResult(req)

    if (!error.isEmpty()){
        console.log(error.array())
        return res.status(422).render('auth/buyerSignUp', {
            pageTitle: 'Sign Up',
            errorMessage: error.array()[0].msg
        })
    }

    let imagePath;
    if (image){
        imagePath = image.filename
    } 
    bcrypt.hash(password, 12)
    .then(hashedPassword =>{
            const buyer = new Buyer({
            email: email,
            phoneNumber: phoneNumber,
            image: imagePath,
            username: username,
            password: hashedPassword,
            wishList: []
        })
         return buyer.save()
        })
        .then(result =>{
            //log in the user
            return Buyer.findOne({email: email})
        })
        .then(newUser => {
            if(!newUser){
                return res.redirect('/1')
            }
            req.session.user = newUser
            req.session.isAuthenticated = true
            req.session.isSeller = false
            return res.redirect('/1')
    })
    .catch(error => {
        const err = new Error(error)
        err.httpStatusCode = 500
        next(err)
    })

}



exports.sellerSignUp = (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const phoneNumber = req.body.phoneNumber
    const image = req.file
    const password = req.body.password

    

    if(!image){
        return res.status(422).render('auth/sellerSignUp', {
            pageTitle: 'Sign Up',
            errorMessage: 'Attached file is not an image'
        }
        )
    }
    
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        imageDelete(image.path)
        return res.status(422).render('auth/sellerSignUp', {
            pageTitle: 'Sign Up',
            errorMessage: errors.array()[0].msg
        })
    }

    const imagePath = image.filename;
    
    bcrypt.hash(password, 12)
        .then(hashedPassword =>{
        const seller = new Seller({
                name: name,
                email: email,
                phoneNumber: phoneNumber,
                image: imagePath,
                password: hashedPassword
        
            })
            return seller.save()

        })
        .then(result =>{
            return Seller.findOne({email: email})
        })
        .then(newUser => {
            if (!newUser){
                return res.redirect('/1');
            };
            req.session.user = newUser;
            req.session.isAuthenticated = true;
            req.session.isSeller = true;
            return res.redirect('/1')            
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)   
        })

}





exports.getLogin = (req, res, next) => {
    let loginMessage = null;
    if(req.query.loginMessage){
        loginMessage = 'Authorization denied for non-seller account. Login first.'
    }
    res.render('auth/login',{
        pageTitle: 'Login',
        sellerErrorMessage: '',
        buyerErrorMessage: '',
        buyerProvideEmail: '',
        sellerProvideEmail: '',
        authMessage: loginMessage

    })
}

exports.postBuyerLogin = (req, res, next) =>{
    const email = req.body.email
    const password = req.body.password


    const error = validationResult(req)

    if(!error.isEmpty()){
        return res.render('auth/login',{
            pageTitle: 'Login',
            buyerErrorMessage: error.array()[0].msg,
            sellerErrorMessage: '',
            sellerProvideEmail: '',
            buyerProvideEmail: email,
            authMessage: null
    
        })
    }

    Buyer.findOne({email: email})
    .then(user => {
        if(!user){
            return res.render('auth/login',{
                pageTitle: 'Login',
                buyerErrorMessage: 'Email or password is not valid',
                sellerErrorMessage: '',
                buyerProvideEmail: email,
                sellerProvideEmail: '',
                authMessage: null
        
            })
        }
        bcrypt.compare(password, user.password)
        .then(match => {
            if(!match){
                return res.render('auth/login',{
                    pageTitle: 'Login',
                    errorMessage: "Email or Password is not valid",
                    buyerProvideEmail: email,
                    sellerProvideEmail: '',
                    authMessage: null,
            
                })
            }
            req.session.isAuthenticated = true
            req.session.user = user
            req.session.isSeller = false
            // redirect to home page for now
            return req.session.save(err => {
                res.redirect('/1')
            })
        })
        .catch(error => {
            const err = new Error(error)
            err.httpStatusCode = 500
            return next(err)
        })
    })
    .catch(error => {
        const err = new Error(error)
            err.httpStatusCode = 500
            return next(err)
    })
}


exports.postSellerLogin = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    const redirectRoute = req.body.redirect



    const error = validationResult(req)

    if(!error.isEmpty()){
        return res.render('auth/login',{
            pageTitle: 'Login',
            sellerErrorMessage: error.array()[0].msg,
            buyerErrorMessage: '',
            sellerProvideEmail: email,
            buyerProvideEmail: '',
            authMessage: redirectRoute ? 'Authorization denied for non-seller account' : null
        })

    }

    Seller.findOne({email: email})
    .then(user => {
        if(!user){
            return res.render('auth/login',{
            pageTitle: 'Login',
            sellerErrorMessage: 'Email or Password is not valid',
            buyerErrorMessage: '',
            sellerProvideEmail: email,
            buyerProvideEmail: '',
            authMessage: redirectRoute ? redirectRoute : null
        })
        }

        bcrypt.compare(password, user.password)
        .then(match => {
            if(!match){
             return res.render('auth/login',{
                pageTitle: 'Login',
                sellerErrorMessage: "Email or password is not valid",
                buyerErrorMessage: '',
                sellerProvideEmail: email,
                buyerProvideEmail: '',
                authMessage: redirectRoute ? redirectRoute : null
            })
        }
            req.session.isAuthenticated = true
            req.session.user = user
            req.session.isSeller = true
            return req.session.save(err => {
                if(redirectRoute === "admin"){
                    res.redirect('/admin/homepage')
                }else{res.redirect('/1')}
            })
        })
        .catch(error => {
            const err = new Error(error)
            err.httpStatusCode = 500
            return next(err)
        })
    })
    .catch(error =>{
        const err = new Error(error)
            err.httpStatusCode = 500
            return next(err)
    })
}

exports.getResetPassword = (req, res, next)=>{
    const userStatus = req.params.userStatus
    console.log(userStatus)
    res.render('auth/reset-password', {
        pageTitle: 'Reset Password',
        errorMessage: null,
        userStatus: userStatus
    })
}


exports.postGetResetPassword = (req, res, next)=>{
    const userEmail = req.body.email
    const userStatus = req.body.userStatus


    const token = crypto.randomBytes(32).toString('hex')
        if(userStatus === 'buyer'){
            Buyer.findOne({email: userEmail})
            .then(buyer =>{
                if(!buyer){
                    return res.status(422).render('auth/reset-password', {
                        pageTitle: 'Reset Password',
                        errorMessage: 'The email is none exist.',
                    })
                }
                buyer.token = token
                buyer.tokenDate = Date.now() + 3600000
                return buyer.save()

            })
            .then(saveSuccess =>{
                res.redirect('/password-reset-response')
                return transporter.sendMail({
                  to: req.body.email,
                  from: 'fullstackmayor@gmail.com',
                  subject: 'Password reset',
                  html: `
                    <p>You requested a password reset</p>
                    <p>Click this <a href="http://localhost:3000/reset/${token}/${userStatus}">link</a> to set a new password.</p>
                  `
                })
            })
            .catch(error =>{
                const err = new Error(error)
                err.httpStatusCode = 500
                next(err)
                console.log(error)
            })
        }

        else if(userStatus === 'seller'){
            Seller.findOne({email: userEmail})
            .then(seller =>{
                if(!seller){
                    return res.status(422).render('auth/reset-password', {
                        pageTitle: 'Reset Password',
                        errorMessage: 'The email is none exist.',
                    })
                }
                seller.token = token
                seller.tokenDate = Date.now() + 3600000
                return seller.save()
            })
            .then(successSave =>{
                res.redirect('/password-reset-response')

                
                const request = mailjet
                .post("send", {'version': 'v3.1'})
                .request({
                "Messages":[
                    {
                    "From": {
                        "Email": "fullstackmayor@gmail.com",
                        "Name": "Abraham"
                    },
                    "To": [
                        {
                        "Email": userEmail,
                        "Name": "Abraham"
                        }
                    ],
                    "Subject": "Password reset",
                    "TextPart": "Reset your password",
                    "HTMLPart": `
                    <p>You requested a password reset</p>
                    <p>Click this <a href="http://localhost:3000/reset/${token}/${userStatus}">link</a> to set a new password.</p>
                    `,
                    "CustomID": "AppGettingStartedTest"
                    }
                ]
                })


            request
            .then((result) => {
                console.log(result.body)
            })
            .catch((err) => {
                console.log(err)
            })
                
            })
            .catch(eror =>{
                const err = new Error(error)
                err.httpStatusCode = 500
               next(err)
            })

        }else{
            return res.status(500).redirect('/500')
        }
}

exports.passwordResetResponse = (req, res, next)=>{
    res.render('auth/password-reset-response', {
        pageTitle: 'Token sent'
    })
}

exports.passwordFail =  (req, res, next)=>{
    res.render('auth/password-reset-fail',{
        pageTitle: 'Reset Fail'
    })
}


exports.passwordSuccess = (req, res, next)=>{
    res.render('auth/password-reset-success'), {
        pageTitle: 'Reset Success'
    }
}


exports.getNewPassword = (req, res, next)=>{
    const userToken = req.params.token
    const status = req.params.userStatus

    if(status === 'seller'){
        Seller.findOne({token: userToken, tokenDate: {$gt: Date.now()}})
        .then(seller =>{
            if(!seller){
                return res.status(422).render('auth/password-reset-fail', {
                    pageTitle: 'Password Failed'
                })
            }
            return res.render('auth/new-password', {
                pageTitle: 'Password Reset',
                status: status,
                token: userToken,
                errorMessage: '',
                userId: seller._id
            })
        })
        .catch(error =>{
            const err = new Error(error)
            err.httpStatusCode = 500
            next(err)
        })
        
    }
    else if(status === 'buyer'){
        Buyer.findOne({token: userToken, tokenDate: {$gt: Date.now()}})
        .then(buyer =>{
            if(!buyer){
                return res.status(422).render('auth/password-reset-fail', {
                    pageTitle: 'Password Failed'
                })
            }
            return res.render('auth-new-password', {
                pageTitle: 'Password Reset',
                status: status,
                token: userToken,
                errorMessage: '',
                userId: buyer._id
            })
        })
        .catch(error =>{
            const err = new Error(error)
            err.httpStatusCode = 500
            next(err)
        })
        

    }else{
        return res.status(500).redirect('/500')
    }
}


exports.postNewPassword =(req, res, next)=>{
    const newPassword = req.body.password
    const token = req.body.token
    const userStatus = req.body.userStatus
    const userId = req.body.userId

    if(userStatus === 'buyer'){
        Buyer.findOne({token: token, _id: userId, tokenDate: {$gt: Date.now()}})
        .then(buyer =>{
            if(!buyer){
                return res.status(422).render('auth/password-reset-fail', {
                    pageTitle: 'Password Failed'
                })
            }
            bcrypt.hash(newPassword, 12)
            .then(hashedPassword =>{
                buyer.password = hashedPassword
                buyer.token = undefined
                buyer.tokenDate = undefined
                return buyer.save()
            })
            .then(saveSuccess =>{
                res.redirect('/password-reset-success')
            })
            .catch(err =>{
                const error = new Error(err)
                error.httpStatusCode =500
                next(error)
            })
        })
        .catch(err =>{
            const error = new Error(err)
            error.httpStatusCode = 500
            next(error)
        })
    }
    else if(userStatus === 'seller'){
        Seller.findOne({token: token, _id: userId, tokenDate: {$gt: Date.now()}})
        .then(seller =>{
            if(!seller){
                return res.status(422).render('auth/password-reset-fail', {
                    pageTitle: 'Password Failed'
                })
            }
            bcrypt.hash(newPassword, 12)
            .then(hashedPassword =>{
                seller.password = hashedPassword
                seller.token = undefined
                seller.tokenDate = undefined
                return seller.save()
            })
            .then(saveSuccess =>{
                res.redirect('/password-reset-success')
            })
            .catch(err =>{
                const error = new Error(err)
                error.httpStatusCode = 500
                next(error)
            })
        })
        .catch(err =>{
            const error = new Error(err)
            error.httpStatusCode =500
            next(error)
        })
        
    }
    else{
        return res.status(500).redirect('/1')
    }

}

exports.logOut = (req, res, next)=>{
    req.session.destroy(error =>{
        return res.redirect('/1')
    })
}