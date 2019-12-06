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
    wishList: {
        items: [
        {
            goodsId: {
                type: Schema.Types.ObjectId,
                ref: 'Goods'
            }
        }
        ]
    }

})

buyerSchema.methods.addWishList =  function(productId){
    const updateWishList =  [...this.wishList.items]
    updateWishList.push(productId)
    this.wishList.items = updateWishList
    return this.save()
}

module.exports = mongoose.model('Buyer', buyerSchema)