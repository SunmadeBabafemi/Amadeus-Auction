const User = require('../models/user')
module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.registerUser = async (req, res) => {
    try {
        const { email, username, password, address } = req.body
        const user = new User({ email, username, address})
        const regUser = await User.register(user, password)
        req.login(regUser, err => {
            if (err) return next(err)
            req.flash('success', "Welcome to Amadues Auction")
            res.redirect('/auctions')
        })
    } catch (err) {
        req.flash('error', err.message)
        res.redirect('/register')
        
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.loginUser = (req, res) => {
    req.flash('succes', 'Welcome Back')
    const redirectUrl = req.session.returnTo || '/auctions'
    res.redirect(redirectUrl)
}

module.exports.logOutUser = (req, res) => {
    req.logout()
    req.flash('success', 'LOgged out successfully')
    res.redirect('/')
}