
const Goods = require('../models/goods')
const Buyer = require('../models/buyer')

exports.reviewProduct = (req, res, next)=> {
    const getId = req.body.productId
    const reviewOption = req.body.review
    const userId = req.user._id

    Goods.findById(getId)
    .then(goods => {
        if(!goods){
            return next(new Error('Goods not found'))
        }
        else if(goods.checkReview(userId)){
            return res.status(500).redirect(`/product-details/${getId}`)
        }
        else{
        return goods.addReview(userId, reviewOption)
        .then(success =>{
            req.flash('review-success', 'You have reviewed the product')
            res.redirect(`/product-details/${getId}`)
        })
        }    
    })
    .catch(error => next(error))
}


exports.buyerWishList =(req, res, next)=>{
    const goodsId = req.params.goodsId
    const user = req.user
    
    if(!user.checkWishlist(goodsId)){
        user.addWishList(goodsId)
        .then(saved =>{
        res.status(200).json({message: 'wishAdded'})
        })
    .catch(error => {
        res.status(500).json({message: 'wishAddFail'})
    })
        
    }else{
        req.user.removeWishlist(goodsId)
     .then(success => {
         return res.status(200).json({message: 'wishRemoved'})
     })
     .catch(error => {
         res.status(500).json({message: 'wishRemoveFail'})
     })

    }


}


