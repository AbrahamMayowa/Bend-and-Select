const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const csrf = require('csurf')
const session = require('express-session')
const MongodbSession = require('connect-mongodb-session')(session)
const flash = require('connect-flash')
const multer = require('multer')
const aws = require( 'aws-sdk' )
const multerS3 = require( 'multer-s3' )
require('dotenv').config()

const {s3} = require('./utils/deleteS3Image')

const Seller = require('./models/seller')
const Buyer = require('./models/buyer')
const generalRoute = require('./routes/generalRoute')
const auth = require('./routes/auth')
const sellerAdmin = require('./routes/sellerAdmin')
const buyerRoute = require('./routes/buyerAction')
const error = require('./controllers/error')
const statusError = require('./routes/error')



const app = express()

const csrfProtection = csrf()


app.set('view engine', 'ejs');
app.set('views', 'views');



MONGODB_URL =  process.env.MONGODB_URL


// creating session document

const store = new MongodbSession({
    uri: MONGODB_URL,
    collection: 'session'
})




const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + '-' + file.originalname)
    }
    })


const s3Storage = multerS3({
  s3,
  bucket: 'bend-and-select.com',
  acl: 'public-read',
  metadata: function(req, file, cb){
    cb(null, {fieldName: file.fieldname})
  },
  key: function(req, file, cb){
    cb(null, new Date().toISOString() + '-' + file.originalname)
  }
})    


const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: store,
        cookie: { expires: new Date(Date.now() + (30 * 86400 * 1000))}
    })
)


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/image', express.static(path.join(__dirname, 'images')))

// file configuraitons
app.use(
    multer({ storage: s3Storage, fileFilter: fileFilter }).single('image')
  )

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
            }).catch(error =>{
                next(error)
            })
        }else{
        Buyer.findById(req.session.user._id)
        .then(user =>{
            req.user = user
            return next()
        })
        .catch(error =>{
          next(error)
        })
        

    }
})




app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    res.locals.isAuthenticated = req.session.isAuthenticated || false
    res.locals.isSeller = req.session.isSeller || false
    next()
})



app.use(auth)
app.use(generalRoute)
app.use('/admin', sellerAdmin)
app.use(buyerRoute)
app.use(statusError)

app.use(error.error404)

app.use((error, req, res, next) => {
  console.log(error)
    res.status(500).render('error/500',{
        pageTitle: 'Error 500'
    })
})

mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => app.listen(process.env.PORT, () => console.log('working')))
.catch(error => console.log(error))