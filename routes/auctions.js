const express = require('express')
const router = express.Router()
const catchAsync =  require('../utilities/CatchAsync');
const auctions = require('../controllers/auctions')
const {isLoggedIn} = require('../middleware')
const multer  = require('multer')
const { storage } = require('../cloudinary');
const { removeListener } = require('../models/user');
const upload = multer({ storage })


router.route('/')
    .get(catchAsync(auctions.index))
    .post(isLoggedIn, upload.array('auction[image]'), catchAsync(auctions.createNew))

router.get('/new', isLoggedIn, auctions.renderNew)

router.route('/:id')
    .get(catchAsync(auctions.showpage))



module.exports = router