const Goods = require('../models/goods')
const {deleteS3Image} = require('../utils/deleteS3Image')

const {validationResult} = require('express-validator')
const moment = require('moment')

exports.adminHome = (req, res, next) => {
    const successInfo = req.flash('productAddSuccess')
    const priceFormat = (productPrice)=>{
        return (
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'NGN'
        }).format(productPrice)
        )
    }
    Goods.find({goodsSeller: req.user._id})
    .then(goods => {
        res.render('sellerAdmin/adminHome', {
            allGoods: goods,
            pageTitle: 'Admin',
            successInfo: successInfo.length > 0 ? successInfo[0] : null,
            requestUser: req.user,
            moment,
            priceFormat
        })
    })
    .catch(error => {
        const err  = new Error(error)
        err.httpStatusCode = 500
        next(err)
    })
}




exports.getAddProduct = (req,res, next) =>{
    const successInfo = req.flash('productAddSuccess')
    res.render('sellerAdmin/getAddProduct', {
        pageTitle: 'Add Product',
        price: '',
        name: '',
        image: '',
        description: '',
        errorMessage: '',
        successInfo: successInfo.length > 0 ? successInfo[0] : null
    })
}


exports.postAddProduct = (req, res, next)=>{
    const name = req.body.name
    const category = req.body.category
    const condition = req.body.condition
    const price = req.body.price
    const image = req.file
    const location = req.body.location
    const description = req.body.description


    if(!image){
        return res.render('sellerAdmin/getAddProduct', {
            pageTitle: 'Add Product',
            name: name,
            description: description,
            price: price,
            errorMessage: 'Provide a valid image format',
            
        })
    }


    const error = validationResult(req)

    if(!error.isEmpty()){
        deleteS3Image(image.key)
        return res.render('sellerAdmin/getAddProduct', {
            pageTitle: 'Add Product',
            name: name,
            price,
            description: description,
            errorMessage: error.array()[0].msg,
            
        })
    }


    console.log(image)
    const goods = new Goods({
        name: name,
        createdDate: Date.now(),
        category: category,
        condition: condition,
        price: price,
        description: description,
        image: image.location,
        imageKey: image.key,
        location: location,
        review: {
            buyerReview: [],
            reviewRanking: {},
            reviewAverage: {}
        },
        goodsSeller: req.user._id
    })

    return goods.save()
    .then(save => {
        // will later redirect to goods details
        req.flash('productAddSuccess', 'Product successfully added')
        res.redirect('/admin/homepage')
    })
    .catch(error => {
        const err = new Error(error)
        error.httpStatusCode = 500
        return next(err)
    })
}


exports.getProductEdit = (req, res, next) =>{
    
    const getId = req.params.productId

    Goods.findById(getId)
    .then(goods => {
        res.render('sellerAdmin/editProduct', {
            pageTitle: 'Product Edit',
            goods: goods,
            errorMessage: '',
           
        })
    })
    .catch(error =>{
        const err = new Error(error)
        err.httpStatusCode = 500
        next(err)
    })
}


exports.postProductEdit = async(req, res, next)=>{
    const getId = req.body.productId
    const name = req.body.name
    const price = req.body.price
    const description = req.body.description
    const category = req.body.category
    const condition = req.body.condition
    const image = req.file
    const location = req.body.location

    try{
        const goods = await Goods.findById(getId)
        if(goods.goodsSeller.toString() !== req.user._id.toString()){
            return res.status(401).redirect('/401')
        }

        const error = validationResult(req)
        if(!error.isEmpty()){
            return res.render('sellerAdmin/editProduct', {
                pageTitle: 'Product Edit',
                goods: goods,
                errorMessage: error.array()[0].msg,
                })
            }
        
        let imagePath = goods.image
        let imagekey = goods.imageKey
        if(image){
            imagePath = image.location
            imagekey = image.key
            deleteS3Image(goods.imageKey)
        }

        goods.name = name
        goods.price = price
        goods.category = category
        goods.condition = condition
        goods.image = imagePath,
        goods.imageKey = imageKey
        goods.location = location,
        goods.description = description
        await goods.save()

        req.flash('editSuccess', 'Product successfully edited!')
        res.redirect(`/product/${getId}`)
    
    }catch(error){next(error)}
}

exports.deleteProduct = async (req, res, next) => {
    const getId = req.body.productId

    try{
    const goods = await Goods.findById(getId)
        if(goods.goodsSeller.toString() !== req.user._id.toString()){
            return res.status(401).redirect('/401')
        }

        await deleteS3Image(goods.imageKey)
        await Goods.deleteOne({_id: goods._id})

        req.flash('deleteProduct', 'Goods successfully deleted')
        return res.redirect('/admin/homepage')

    }catch(error){ next(error)}

}


