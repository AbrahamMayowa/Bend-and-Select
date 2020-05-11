
const Goods = require('../models/goods')
const Buyer = require('../models/buyer')

exports.reviewProduct = (req, res, next)=> {
    const getId = req.body.productId
    const reviewOption = req.body.reviewValue
    const userId = req.user._id
    console.log(reviewOption)
    Goods.findById(getId)
    .then(goods => {
        if(!goods){
            next(new Error('Goods not found'))
        }
        else if(goods.checkReview(userId)){
            res.status(500).redirect(`/product/${getId}`)
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


exports.buyerWishList = async (req, res, next)=>{
    const goodsId = req.params.goodsId
    const user = req.user
    
    if(!user.checkWishlist(goodsId)){
        try{
        await user.addWishList(goodsId)
        res.status(200).json({message: 'wishAdded'})

        }catch(error){
        res.status(500).json({message: 'wishAddFail'})
        }
        
    }else{
        try{
            await user.removeWishlist(goodsId)
            res.status(200).json({message: 'wishRemoved'})
        }catch(error){
            res.status(500).json({message: 'wishRemoveFail'})
        }

    }


}


