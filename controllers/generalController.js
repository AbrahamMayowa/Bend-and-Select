const Goods = require('../models/goods')
const moment = require('moment')

exports.goodsLists = async (req, res, next) => {
    const page = req.params.page || 1
    const perPage = 6


    try{
    const goods = await Goods.find()
        .skip((perPage * page) - perPage)
        .limit(perPage)
    const availableGoods = await Goods.countDocuments()
    const trending = await Goods.find().sort({review: -1}).limit(4)
    res.render('general/homePage', {
            allGoods: goods,
            currentPage: page,
            pages: Math.ceil(availableGoods / perPage),
            trending, 
            pageTitle: 'Home'
        })
    }catch(error){
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
    const userJoined = moment(goods.goodsSeller.joined).fromNow()
    const productPostedOn = moment(goods.createdDate).fromNow()
       
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
