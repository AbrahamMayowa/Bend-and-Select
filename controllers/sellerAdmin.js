const Goods = require('../models/goods')

exports.adminHome = (req, res, next) => {
    Goods.find()
    .then(goods => {
        res.render('sellerAdmin/adminHome', {
            allGoods: goods,
            pageTitle: 'Admin'
        })
    })
    .catch(error => console.log(error))
}




exports.getAddProduct = (req,res, next) =>{
    res.render('sellerAdmin/getAddProduct', {
        pageTitle: 'Add Product',
    })
}


exports.postAddProduct = (req, res, next)=>{
    const name = req.body.name
    const category = req.body.category
    const condition = req.body.condition
    const image = req.body.image
    const location = req.body.location
    const description = req.body.description

    const goods = new Goods({
        name: name,
        category: category,
        condition: condition,
        description: description,
        image: image,
        location: location,
        review: [],
        goodsSeller: req.user._id
    })

    return goods.save()
    .then(save => {
        // will later redirect to goods details
        res.redirect('/admin/homepage')
    })
    .catch(error => console.log(error))
}



exports.productDetails = (req, res, next)=> {
    const getId =  req.params.productId

    Goods.findById(getId)
    .then(goods => {
        res.render('sellerAdmin/productDetails', {
            pageTitle: 'Product',
            productDetails: goods
        })
    })

}


exports.getProductEdit = (req, res, next) =>{
    let errorMessage = req.flash('errorMessage')

    if(errorMessage.length > 0){
        errorMessage = errorMessage[0]
    }else{
        errorMessage = null
    }

    const getId = req.params.productId

    Goods.findById(getId)
    .then(goods => {
        res.render('sellerAdmin/editProduct', {
            pageTitle: 'Product Edit',
            goods: goods,
            errorMessage: errorMessage
        })
    })
}


exports.postProductEdit = (req, res, next)=>{
    const getId = req.body.productId
    const name = req.body.name
    const category = req.body.category
    const condition = req.body.condition
    const image = req.body.image
    const location = req.body.location

    Goods.findById(getId)
    .then(goods => {
        goods.name = name
        goods.category = category
        goods.condition = condition
        goods.image = image
        goods.location = location
        return goods.save()
    })
    .then(result => {
        req.flash('editSuccess', 'Your goods had been successfully edited!')
        res.redirect(`/admin/product-details/${getId}`)
    })
    .catch(error => console.log(error))
}


exports.deleteProduct = (req, res, next) => {
    const getId = req.body.productId

    Goods.deleteOne({_id: getId})
    .then(result =>{
        req.flash('deleteProduct', 'Goods successfully deleted')
        res.redirect('/admin/homepage')
    })
}


