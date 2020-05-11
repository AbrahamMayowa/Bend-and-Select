const mongoose = require('mongoose')


const imageDeleteHelper = require('../utils/deleteImage')

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
        type: String,
        required: true

    },

    location: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    createdDate: {
        type: Date,
        dafault: Date.now
    },

    review:{
        buyerReview: [
            {reviewer: {
                type: Schema.Types.ObjectId,
                ref: 'Buyer',
                }
            }
        ],
        reviewRanking: {
            five: {
                type: Number,
                default: 0
            },
            four: {
                type: Number,
                default: 0
            },
            three: {
                type: Number,
                default: 0,
            },
            two: {
                type: Number,
                default: 0,
            },
            one: {
                type: Number,
                default: 0
            }

        },

        reviewAverage: {
            sum: {
                type: Number,
                default: 0,
            },

            lengthCount: {
                type: Number,
                default: 0
            },
            averageScore: {
                type: Number,
                default: 0
            }
            
        }
    },

    goodsSeller: {
        type: Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    }    
})

goodsSchema.methods.addReview = function(raterId, rateRank){
    const updateAverage = {...this.review.reviewAverage}
    const parseRateRank = parseInt(rateRank)
    const newSum = updateAverage.sum + parseRateRank
    const newLength = updateAverage.lengthCount + 1
    const average = Math.trunc(newSum/newLength)
    updateAverage.sum = newSum
    updateAverage.lengthCount = newLength
    updateAverage.averageScore = average
    this.review.reviewAverage = updateAverage

    const updateReview = {...this.review.reviewRanking}
    const updateBuyerReview = [...this.review.buyerReview]
    updateBuyerReview.push({reviewer: raterId})
    this.review.buyerReview = updateBuyerReview
    typeof(rateRank)


    // to provide lateral value for the reviewRanking
    let rankValue
    switch (rateRank) {
        case 1:
            rankValue = 'one'
            break;
        case 2:
            rankValue = 'two'
            break;
        case 3:
            rankValue = 'three'
            break;

        case 4:
            rankValue = 'four'
            break;

        case 5:
            rankValue = 'five'
            break;
    }

  
    const updateRank = updateReview[rankValue] + 1
    updateReview[rankValue] = updateRank
    this.review.reviewRanking = updateReview
    return this.save()

}


goodsSchema.methods.checkReview = function(userId){
    const userIndex = this.review.buyerReview.findIndex(buyer => buyer.reviewer.toString() === userId.toString())
    if (userIndex > -1){
        return true
    }else{
    return false
    }
}


module.exports = mongoose.model('Goods', goodsSchema)