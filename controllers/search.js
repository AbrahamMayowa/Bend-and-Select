import Goods from '../models/goods'

exports.searchQuery = async(req, res, next)=>{
    
    const search = req.query.search
    const page = req.params.page || 1
    const perPage = 5
    const filter = req.query.filterValue

    let productFound
    let availbleGoods

    try {

    // if the request is about search for a product
    if(search){
        productFound = await Goods.find({name: new RegExp(search, 'i')}).skip((perPage * page) - perPage).limit(perPage)
        availbleGoods = await Goods.countDocuments({name: new RegExp(search, 'i')})
    }else if(filter){
        // here the user request for products using the filter link
        productFound = await Goods.find({category: filter}).skip((perPage * page) - perPage).limit(perPage)
        availbleGoods = await Goods.countDocuments({category: filter})
    }

    res.render('search', {
        products: productFound,
        numberOfProduct: availbleGoods,
        currentPage: page,

        // the layout will be different base on if the page will render search result or filter
        isFilter: filter ? true : false,
        searchWord: search ? search : null,
        filter: filter ? filter : null,
        pages: Math.ceil(numberOfProduct / perPage),
        pageTitle: filter ? filter : 'Search'
    })
}catch(error){
    console.log(error)
    next(error)
}
}