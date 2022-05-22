const mongoose = require('mongoose')
const Schema = mongoose.Schema


const BidSchema = new Schema({
    bidder: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    auction: {
        type: Schema.Types.ObjectId,
        ref: 'Auction'
    },
    date: {
        type: String,
        default: new Date().toLocaleTimeString()
    },
    price: Number
},
{collection: 'bids'}
)

let Bid = mongoose.model('Bid', BidSchema)

module.exports = Bid