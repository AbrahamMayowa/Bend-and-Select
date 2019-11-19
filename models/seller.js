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
        data: Buffer,
        contentType: String
    },

    joined: {
        type: Date,
        default: Date.now
    },
    
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Seller', sellerSchema)