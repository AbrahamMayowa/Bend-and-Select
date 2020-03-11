const Goods = require('../models/goods')
const moment = require('moment')

exports.goodsLists = async (req, res, next) => {
    const page = req.params.page || 1
    const perPage = 4


    try{
    const goods = await Goods.find()
        .skip((perPage * page) - perPage)
        .limit(perPage)
    const availableGoods = await Goods.countDocuments()
    const trending = await Goods.find().sort({review: -1})
    res.render('general/homePage', {
            allGoods: goods,
            currentPage: page,
            pages: availableGoods / perPage,
            trending, 
            pageTitle: 'Home'
        })
    }catch(error){
        console.log(error)
        next(error)
    }
}


exports.productDetails = async (req, res, next)=> {
    const getId =  req.params.productId

    let checkWishlist = null

    let checkReview = false

    try{
    const goods = await Goods.findById(getId).populate('goodsSeller')

    if(req.user && !req.session.isSeller){

        // it return true or false if user had added this product to his/her wishlist 
        checkWishlist = await req.user.checkWishlist(goods._id)

        //check the user has reviewed the product before. return true or false

        checkReview = goods.checkReview(req.user._id)

    }
    const createdTime = new Date(goods.goodsSeller.joined).toJSON()
    const userJoined = moment(createdTime).fromNow()
    const productTime = new Date(goods.createdDate).toJSON()
    const productPostedOn = moment(productTime).fromNow()
       
    res.render('general/productDetails', {
            pageTitle: 'Product',
            userJoined,
            productPostedOn,
            productDetails: goods,
            requestUser: req.user_id || null,
            wishlist: checkWishlist,
            productId: goods._id,
            checkReview: checkReview
        })
    
    }catch(error){
        next(error)
    }

}
