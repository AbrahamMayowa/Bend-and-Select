const router = require('express').Router()

const {body} = require('express-validator')

const auth = require('../customMiddleware/isAuth')

const buyerControllers = require('../controllers/buyerAction')


router.post('/review', auth.onlyAuthentcatedUser, [
    body('review').not().isNumeric().withMessage('Must be a digit number').custom((value, {req})=> {
        if (value > 5 || value < 1){
                return Promise.reject('The review must be between one and five figure')
            }
        })
], buyerControllers.reviewProduct)

router.post('/wishlist/:goodsId', auth.onlyAuthentcatedUser, buyerControllers.buyerWishList)


module.exports = router