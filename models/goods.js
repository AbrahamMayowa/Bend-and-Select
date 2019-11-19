const mongoose = require('mongoose')

const Schema = mongoose.Schema

const goodsSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    category: {
        type: String,  // category like electronic, accessory etc
        required: true 
    },

    condition: {
        type: String, // this will be in option of either new or old
        required: true,
    },

    image: {
        data: Buffer,
        contentType: String
    },

    location: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    createDate: {
        type: Date,
        dafault: Date.now
    },

    review:[
        {
            rating: {
                type: Number
            },
            rater: {
                type: Schema.Types.ObjectId,
                ref: 'Buyer',
                required: true
            }
        }
    ],

    goodsSeller: {
        type: Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    }

    
})

goodsSchema.methods.addReview = function(){
    
}

module.exports = mongoose.model('Goods', goodsSchema)