const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const csrf = require('csurf')
const session = require('express-session')
const MongodbSession = require('connect-mongodb-session')(session)
const flash = require('connect-flash')






const Seller = require('./models/seller')
const Buyer = require('./models/buyer')
const generalRoute = require('./routes/generalRoute')
const auth = require('./routes/auth')
const sellerAdmin = require('./routes/sellerAdmin')


const app = express()

const csrfProtection = csrf()


app.set('view engine', 'ejs');
app.set('views', 'views');



MONGODB_URL =  "mongodb+srv://bend-and-select:admin-password@cluster0-ol5r1.mongodb.net/bend-and-select?retryWrites=true&w=majority"


// creating session document

const store = new MongodbSession({
    uri: MONGODB_URL,
    collection: 'session'
})

app.use(
    session({
        secret: 'bend-and-select',
        resave: false,
        saveUninitialized: false,
        store: store
    })
)


app.use(bodyParser.urlencoded({ extended: false }))

app.use(flash())
app.use(csrfProtection)


// saving the authenticated user in the request object
app.use((req, res, next) =>{
    if(!req.session.user){
        return next()
    }else if (req.session.isSeller){
            Seller.findById(req.session.user._id)
            .then(user =>{
                req.user = user
                return next()
            })
        }else{
        Buyer.findById(req.session.user._id)
        .then(user =>{
            req.user = user
            return next()
        })
        

    }
})




app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    res.locals.isAuthenticated = req.session.isAuthenticated

    next()
})


app.use(generalRoute)
app.use(auth)
app.use('/admin', sellerAdmin)


mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true})
.then(response => app.listen(3000, () => console.log('working')))
.catch(error => console.log(error))