const mongoose = require('mongoose')
const passportlLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema
const Auction = require('./auction')

const UserSchema = new Schema({
    // fullName: {
    //     type: String,
    //     required: true
    // },
    email: {
        type: String,
        required: true,
        unique: true
    },

    address: {
        type: String,
        required: true
    },
    auctions: [
        {type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction'}
    ],

    bids: [
        {type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid'}

    ]
},
{collection: 'users'}
)

UserSchema.plugin(passportlLocalMongoose)

let User = mongoose.model('User', UserSchema)
module.exports = User