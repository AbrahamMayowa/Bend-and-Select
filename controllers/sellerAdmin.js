const Goods = require('../models/goods')
const imageDelete = require('../utils/deleteImage')

const {validationResult} = require('express-validator')

exports.adminHome = (req, res, next) => {
    const successInfo = req.flash('productAddSuccess')
    Goods.find()
    .then(goods => {
        res.render('sellerAdmin/adminHome', {
            allGoods: goods,
            pageTitle: 'Admin',
            successInfo: successInfo.length > 0 ? successInfo[0] : null
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
    const image = req.file
    const location = req.body.location
    const description = req.body.description


    if(!image){
        return res.render('sellerAdmin/getAddProduct', {
            pageTitle: 'Add Product',
            name: name,
            description: description,
            errorMessage: 'Provide a valid image format',
            
        })
    }


    const error = validationResult(req)

    if(!error.isEmpty()){
        return res.render('sellerAdmin/getAddProduct', {
            pageTitle: 'Add Product',
            name: name,
            description: description,
            errorMessage: error.array()[0].msg,
            
        })
    }

    let imagePath
    if(image){
        imagePath = image.path
    }

    const goods = new Goods({
        name: name,
        category: category,
        condition: condition,
        description: description,
        image: imagePath,
        location: location,
        review: [],
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



exports.productDetails = (req, res, next)=> {
    const getId =  req.params.productId
    const editInfo = req.flash('editSuccess')

    Goods.findById(getId)
    .then(goods => {
        res.render('sellerAdmin/productDetails', {
            pageTitle: 'Product',
            productDetails: goods,
            editInfo: editInfo.length > 0 ? editInfo[0] : null
            
        })
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


exports.postProductEdit = (req, res, next)=>{
    const getId = req.body.productId
    const name = req.body.name
    const category = req.body.category
    const condition = req.body.condition
    const image = req.file
    const location = req.body.location


    Goods.findById(getId)
    .then(goods =>{

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
        
        let imagePath
        if(image){
            imagePath = image.path
        }

        goods.name = name
        goods.category = category
        goods.condition = condition
        goods.image = imagePath
        goods.location = location
        return goods.save()
    })
    .then(result =>{
        req.flash('editSuccess', 'Product successfully edited!')
        return res.redirect(`/admin/product-details/${getId}`)
    })
    .catch(error => next(error))
}

exports.deleteProduct = (req, res, next) => {
    const getId = req.body.productId

    Goods.findById(getId)
    .then(goods =>{
        if(goods.goodsSeller.toString() !== req.user._id.toString()){
            return res.status(401).redirect('/401')
        }
        imageDelete.deleteFile(goods.image)
        return Goods.deleteOne({_id: goods._id})


    })
    .then(result =>{
        req.flash('deleteProduct', 'Goods successfully deleted')
        return res.redirect('/admin/homepage')

    }) 
    .catch(error => next(error))

}


