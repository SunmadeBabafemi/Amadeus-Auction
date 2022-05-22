const mongoose = require('mongoose')
const Schema = mongoose.Schema

var currentdate = new Date(); 
var bid_time =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + (currentdate.getHours()+1) + ":"  
                + currentdate.getMinutes() 

let time = new Date().toLocaleTimeString()
let day = new Date().toDateString()


const ImageSchema = new Schema({
    url: String,
    filename: String
})

const AuctionSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    date_created: {type: String, default: `${time}, ${day}`},
    bid_start: {type: String, default: `${bid_time}`},
    images: [ImageSchema],
    detail: String,
    price: Number,
    bidded: {type: Boolean, default: false},
    sold: {type: Boolean, default: false},
    bids: [
       { type: Schema.Types.ObjectId,
         ref: 'Bid'
       }
    ]
    
},
{ collection: 'auctions' });


let Auction = mongoose.model('Auction', AuctionSchema);

module.exports = Auction;