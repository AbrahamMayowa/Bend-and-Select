const mongoose = require('mongoose')

const Schema = mongoose.Schema

const sellerSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    phoneNumber:{
        type: Number,
        required: true
    },

    image: {
       type: String,
       required: true
    },

    joined: {
        type: Date,
        default: Date.now
    },
    
    token: {
        type: String
    },

    tokenDate: {
        type: Date
    },
    
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Seller', sellerSchema)