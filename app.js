if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const path = require('path');
const express = require('express');
const http = require('http')
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app)
const io = socketio(server)

const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ExpressError = require('./utilities/ExpressError')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const User = require('./models/user')
const localStrategy = require('passport-local')
const MongoStore = require('connect-mongo');
const mongoSanitize = require('express-mongo-sanitize')
const Bid = require('./models/bid')


const userRoutes = require('./routes/users');
const auctionRoutes = require('./routes/auctions');
// const bidRoutes = require('./public/javascripts/bids.js')



const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/amadeus-auction'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,  
    // useCreateIndex: true
})
.then(()=>{
    console.log('MONGO CONNECTION OPEN!!')
})
.catch((err)=>{
    console.log('OOPS!! MONGO ERROR')
    console.log(err)
})



app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
// this is to serve the 'public' directory
app.use(mongoSanitize());



const secret = process.env.SECRET || 'rosicky'

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60,
})

store.on("error", function(e) {
    console.log("SESSION ERROR!", e)
})

const sessionConfig = {
    store,
    name: 'thomas',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}


app.use(session(sessionConfig))
app.use(flash())


app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    // console.log(req.query)
    res.locals.currentUser = req.user
    // this grants access to current userr in all templates
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/', userRoutes)
app.use('/auctions', auctionRoutes)
// app.use('/auctions/:id/bids', bidRoutes)

app.get('/', (req, res) => {
    res.render('home')
})

// app.all('*', (req, res, next) => {
//     next(new ExpressError('Page not found', 404))
// })


// Run when a client connects
io.on('connection', (socket, request) => {
    console.log(" Web Socket Connected")
    // var tempVars = request.url.split("?")[1].split("&")
    // var userObject = getVars(tempVars)
    // ws.locals.parentId = userObject.parentId
    // const currentUser =  activeUsers.findOne({ _id: userObject.parentID })

    socket.emit('message', `User Ready To Bid`) 

    //Broadcasts When A User Connects to all users except the particular User
    socket.broadcast.emit('message', 'A User has Joined this Auction')

    //Informs when a user has left the auction page
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left this auction')
    })

    // Listen For Bids Submitted
    socket.on('bidPrice', (price) => {
        
        const bidPrice = new Bid({price: price})
        bidPrice.save().then(() => {
            io.emit('price', bidPrice.price)
        })

    })
 
})


const port = process.env.PORT || 2022
server.listen(port, ()=>{
    console.log(`LISTENING ON PORT ${port}!!`)
})