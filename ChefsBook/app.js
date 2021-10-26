if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// express config
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

// app dependencies
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate'); // ejs-mate
const recipeRoutes = require('./routes/recipes'); // recipe routes
const userRoutes = require('./routes/users'); // recipe routes
const session = require('express-session');
const MongoStore = require('connect-mongo'); // mongodb session store
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/users');
const mongoSanitize = require('express-mongo-sanitize'); //requring the mongo sanitizer that prohibits reserved characters to be passed in as query
const helmet = require('helmet');
const ExpressError = require('./utils/ExpressError');

// app config
app.engine('ejs', ejsMate); // setting ejs templates to use ejs locals
app.set('view engine', 'ejs'); // setting view engine
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true })); // for parsing the request body
app.use(methodOverride('_method')); // override with POST having '?_method='
app.use(express.static(__dirname + '/public')); // helps in serving public files
app.use(mongoSanitize({
    replaceWith: '_', // replacing all the prohibited characters with an '_' 
})); // using mongo sanitizer
app.use(helmet()); // enabling helmet

// allowances for sources
const scriptSrcUrls = [];
const connectSrcUrls = [];
const styleSrcUrls = [
    "https://fonts.googleapis.com/"
];
const fontSrcUrls = [
    "https://fonts.googleapis.com/",
    "https://fonts.gstatic.com/",
];
// configuring the content policy 
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", ...connectSrcUrls], // use self and connectSrcUrls
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`, //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    }))

// mongoose config
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/chefsbook'; //  database location variable
const mongoose = require('mongoose');
const db = mongoose.connection;
mongoose.connect(dbUrl);
db.on('error', console.error.bind(console, "CONNECTION ERROR: "));
db.once('open', () => {
    console.log('DATABASE CONNECTED');
})

// session config
const secret = process.env.SECRET || 'thisshouldbeabettersecret'; // process.env.SECRET || session secret key variable

// setting up session store options
const storeConfig = {
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 3600 // time period in seconds
};

// setting up express session options
const sessionConfig = {
    store: MongoStore.create(storeConfig),
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // session for a week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig)); // setting up express session

// passport config
app.use(passport.initialize()); // initialize passport
app.use(passport.session()); // set-up passport for a persistent login session
passport.use(new LocalStrategy(User.authenticate())); // passport will static authenticate method of model in the localstrategy

passport.serializeUser(User.serializeUser()); // serializing user (storing user to a session)
passport.deserializeUser(User.deserializeUser()); // deserializing user (un-storing or retrieving user from a session)

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
}); // variables that are accessible to every template


// app routes
app.get('/', (req, res) => {
    res.render('home');
});

// ROUTES
app.use('/recipes', recipeRoutes); // CRUD routes for recipes
app.use('/', userRoutes); // Auth routes for users

// ERROR Handlers

app.all('*', (req, res, next) => {
    return next(new ExpressError('Page not found!', 404))
});

// 'catch all' generic handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No,Something Went Wrong!"; //checking if the created error contains a message or not 
    res.status(statusCode).render('error', { err });
});

app.listen(port, () => {
    console.log(`Serving on port ${port}`);
})
