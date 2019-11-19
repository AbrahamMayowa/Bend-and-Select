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
        data: Buffer,
        contentType: String
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Buyer', buyerSchema)