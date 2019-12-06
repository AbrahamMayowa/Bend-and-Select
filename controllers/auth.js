const Buyer = require('../models/buyer')

const Seller = require('../models/seller')

const bcrypt = require('bcryptjs')

const {validationResult} = require('express-validator/check')


const errorMessageAb = reqObj => {
    let errorMessage = reqObj.flash('signUpError')

    if (errorMessage.length > 0){
        return errorMessage = errorMessage[0]
    }else{
        return errorMessage = null
    }

}


exports.getSellerSignUp = (req, res, next) => {

        res.render('auth/sellerSignUp', {
        pageTitle: 'Sign Up',
        errorMessage: errorMessageAb(req)
})
}


exports.getBuyerSignUp = (req, res, next) => {
  
    res.render('auth/buyerSignUp', {
        pageTitle: 'Sign Up',
        errorMessage: errorMessageAb(req)
    })
}



exports.sellerSignUp = (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const phoneNumber = req.body.phoneNumber
    const image = req.file
    const password = req.body.password

    if(!image){
        return res.status(422).render(('auth/sellerSignUp', {
            pageTitle: 'Sign Up',
            errorMessage: 'Attached file is not an image'
        })

        )
    }
    
    const validationErrors = validationResult(req)
    if(!validationErrors.isEmpty()){
        return res.status(422).render(('auth/sellerSignUp', {
            pageTitle: 'Sign Up',
            errorMessage: validationErrors.array()[0].msg
        }))
    }

    imagePath = image.path
    Seller.findOne({email: email})
    .then(user =>{
        if (user){
            req.flash('signUpError', 'The email is already exist.')
            return res.redirect('/signup/seller')
        }
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
            Seller.findOne({email: email})
            .then(newUser => {
                req.session.user = newUser
                req.session.isAuthenticated = true
                req.session.isSeller = true
                res.redirect('/')
                })
                .catch(error => console.log(error))
        })
    })
    .catch(error => console.log(error))

}


exports.buyerSignUp = (req, res, next) => {
    const email = req.body.email
    const phoneNumber = req.body.phoneNumber
    const image = req.body.image
    const username = req.body.username
    const password = req.body.password


    Buyer.findOne({email: email})
    .then(user =>{
        if (user){
            req.flash('signUpError', 'The email is already exist. Pick another one.')
            return res.redirect('/signup/buyer')
        }
        bcrypt.hash(password, 12)
        .then(hashedPassword =>{
            const buyer = new Buyer({
            email: email,
            phoneNumber: phoneNumber,
            image: image,
            username: username,
            password: hashedPassword
        })
         return buyer.save()
        })
        .then(result =>{
            //log in the user

            Buyer.findOne({email: email})
            .then(newUser => {
                req.session.user = newUser
                req.session.isAuthenticated = true
                req.session.isSeller = false
                res.redirect('/')
            })
            .catch(error => console.log(error))
    })
})
.catch(error => {console.log(error)})
}

exports.getBuyerLogin = (req, res, next) => {
    let errorMessage = req.flash('logInError')

    if (errorMessage.length > 0){
        errorMessage = errorMessage[0]
    }else{
        errorMessage = null
    }
  

    res.render('auth/buyerLogin',{
        pageTitle: 'Login',
        errorMessage: errorMessage

    })
}

exports.postBuyerLogin = (req, res, next) =>{
    const email = req.body.email
    const password = req.body.password

    Buyer.findOne({email: email})
    .then(user => {
        if(!user){
            req.flash('logInError', 'Invalid password or email.')
            return res.redirect('/login/buyer')   
        }
        bcrypt.compare(password, user.password)
        .then(match => {
            if(!match){
                req.flash('logInError', 'Invalid password or email.')
                return res.redirect('/login/buyer')
            }
            req.session.isAuthenticated = true
            req.session.user = user
            req.session.isSeller = false
            // redirect to home page for now
            res.redirect('/')
        })
    })
    .catch(error => console.log(error))
}



exports.getSellerLogin = (req, res, next) => {
    let errorMessage = req.flash('logInError')

    if (errorMessage.length > 0){
        errorMessage = errorMessage[0]
    }else{
        errorMessage = null
    }
    res.render('auth/sellerLogin',{
        pageTitle: 'Login',
        errorMessage: errorMessage
    })
}

exports.postSellerLogin = (req, res, next) =>{
    const email = req.body.email
    const password = req.body.password

    Seller.findOne({email: email})
    .then(user => {
        if(!user){
            req.flash('logInError', 'Invalid password or email.')
            return res.redirect('/login/seller')   
        }
        bcrypt.compare(password, user.password)
        .then(match => {
            if(!match){
                req.flash('logInError', 'Invalid password or email.')
                return res.redirect('/login/seller')
            }
            req.session.isAuthenticated = true
            req.session.user = user
            req.session.isSeller = true
            return res.redirect('/')
        })
    })
    .catch(error => console.log(error))
}


exports.logOut = (req, res, next) =>{
    req.session.destroy(error => {
        res.redirect('/')

    })  
}