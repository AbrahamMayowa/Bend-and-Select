const Buyer = require('../models/buyer')

const Seller = require('../models/seller')

const bcrypt = require('bcryptjs')

const {validationResult} = require('express-validator');


exports.getSellerSignUp = (req, res, next) => {
    res.render('auth/sellerSignUp', {
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
        return res.status(422).render('auth/buyerSignUp', {
            pageTitle: 'Sign Up',
            errorMessage: error.array()[0].msg
        })
    }

    let imagePath;
    if (image){
        imagePath = image.path
    } 
    bcrypt.hash(password, 12)
    .then(hashedPassword =>{
            const buyer = new Buyer({
            email: email,
            phoneNumber: phoneNumber,
            image: imagePath,
            username: username,
            password: hashedPassword
        })
         return buyer.save()
        })
        .then(result =>{
            //log in the user
            return Buyer.findOne({email: email})
        })
        .then(newUser => {
            if(!newUser){
                return res.redirect('/')
            }
            req.session.user = newUser
            req.session.isAuthenticated = true
            req.session.isSeller = false
            return res.redirect('/')
    })
    .catch(error => {
        const err = new Error(error)
        err.httpStatusCode = 500
        return next(err)
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
        return res.status(422).render('auth/sellerSignUp', {
            pageTitle: 'Sign Up',
            errorMessage: errors.array()[0].msg
        })
    }

    const imagePath = image.path;
    
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
                return res.redirect('/');
            };
            req.session.user = newUser;
            req.session.isAuthenticated = true;
            req.session.isSeller = true;
            return res.redirect('/')
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)   
        })

}





exports.getBuyerLogin = (req, res, next) => {
    res.render('auth/buyerLogin',{
        pageTitle: 'Login',
        errorMessage: ''

    })
}

exports.postBuyerLogin = (req, res, next) =>{
    const email = req.body.email
    const password = req.body.password

    Buyer.findOne({email: email})
    .then(user => {
        bcrypt.compare(password, user.password)
        .then(match => {
            req.session.isAuthenticated = true
            req.session.user = user
            req.session.isSeller = false
            // redirect to home page for now
            return res.redirect('/')
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



exports.getSellerLogin = (req, res, next) => {
   
     res.render('auth/sellerLogin',{
        pageTitle: 'Login',
        errorMessage: ''
    })
}

exports.postSellerLogin = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    Seller.findOne({email: email})
    .then(user => {
        if(!user){
            return res.redirect('/login/seller')   
        }
        bcrypt.compare(password, user.password)
        .then(match => {
            if(!match){
                return res.redirect('/login/seller')
            }
            req.session.isAuthenticated = true
            req.session.user = user
            req.session.isSeller = true
            return res.redirect('/')
        })
        .catch(error => console.log(error))
    })
}


exports.logOut = (req, res, next)=>{
    req.session.destroy(error =>{
        if(error){
            const err = new Error(error)
            err.httpStatusCode = 500
            return next(err)
        }
        res.redirect('/')
    })
}