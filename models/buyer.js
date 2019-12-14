const mongoose = require('mongoose')

const Schema = mongoose.Schema

const buyerSchema = new Schema({

    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    phoneNumber: {
        type: Number,
    },

    image: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },

    token: {
        type: String
    },
    tokenDate: {
        type: Date
    },

    wishList: [
        {
        
            goodsId: {
                type: Schema.Types.ObjectId,
                ref: 'Goods'
            }
        }
        ]

})

buyerSchema.methods.addWishList =  function(productId){
    const updateWishList =  [...this.wishList]
    updateWishList.push({goodsId: productId})
    this.wishList = updateWishList
    return this.save()
}

buyerSchema.methods.removeWishlist = function(productId){
    const updateWishList = [...this.wishList]
    const newWishlist = this.wishList.filter(wish => wish.goodsId.toString() !== productId.toString())
    this.wishList = newWishlist
    return this.save()
}

buyerSchema.methods.checkWishlist = function(productId){

    const listIndex = this.wishList.findIndex(goods => goods.goodsId.toString() === productId.toString())
    if(listIndex > -1){
        return true
    }
    else{
        return false
    }
}

module.exports = mongoose.model('Buyer', buyerSchema)