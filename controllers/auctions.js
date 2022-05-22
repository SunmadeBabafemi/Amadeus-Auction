const Auction = require('../models/auction')
const {cloudinary} = require('../cloudinary')

module.exports.index = async (req, res) => {
    const auctions = await Auction.find({})
    res.render('auctions/index', {auctions})
}

module.exports.renderNew = (req, res) => {
    res.render('auctions/new')
}

module.exports.createNew = async(req, res, next) => {
    const auction = new Auction(req.body.auction)
    auction.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    auction.owner = req.user._id
    await auction.save()
    console.log(auction)
    req.flash('success', 'New Auction Ready for Bidding')
    res.redirect(`/auctions/${auction._id}`)

}


module.exports.showpage = async (req, res) => {
    const auction = await Auction.findById(req.params.id).populate({path:'owner', model: 'User'})
    if(!auction) {
        req.flash('error', 'cannot find auction item')
        res.redirect('/auctions')
    }
    res.render('auctions/show', { auction })
}