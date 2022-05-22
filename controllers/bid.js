const Auction = require('../models/auction')
const Bid = require('../models/bid')

module.exports.createBid = async (req, res) => {
    const auction = await Auction.findById(req.params.id)
    const bid = new Bid(req.body.bid)
    bid.auction = auction._id
    bid.bidder = req.user._id
    await bid.save()

}