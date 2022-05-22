const ExpressError = require('./utilities/ExpressError')
const Auction = require('./models/auction')
const Bid = require('./models/bid')


module.exports.isLoggedIn = (req, res, next) =>  {
    console.log('Req.User...', req.user)
    if (!req.isAuthenticated()) {
        // this is to check if a user is logged in before having access to some links
        req.session.returnTo = req.originalUrl
        //this stores the original url the user was initially trying to access
        req.flash('error', 'You must be logged in')
        return res.redirect('/login')
    }
    next()
}