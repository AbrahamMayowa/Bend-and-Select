
const Goods = require('../models/goods')

exports.reviewProduct = (req, res, next)=> {
    const getId = req.body.productId
    const reviewOption = req.body.review
    const userId = req.user._id
 

    Goods.findById(getId)
    .then(goods => {

        const updateReview = [...goods.review, {
            rating: reviewOption,
            rater: userId
        }]

        goods.review = updateReview
        return goods.save()
    })
    .then(success =>{
        req.flash('review-success', 'You have reviewed the product')
        res.redirect('/product-details/productId')
    })
    .catch(error => next())
}