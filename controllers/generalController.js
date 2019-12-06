const Goods = require('../models/goods')

exports.goodsLists = (req, res, next) => {
    Goods.find()
    .then(goods => {
        res.render('general/homePage', {
            allGoods: goods,
            pageTitle: 'Home'
        })
    })
    .catch(error => console.log(error))
}


exports.productDetails = (req, res, next)=> {
    const getId =  req.params.productId

    Goods.findById(getId)
    .then(goods =>{
        res.render('general/productDetails', {
            pageTitle: 'Product',
            productDetails: goods
        })
    })

}
