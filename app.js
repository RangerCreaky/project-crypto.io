const express = require('express');
const app = express();
const path = require('path')
const session=require('express-session')
const ejsMate = require('ejs-mate')
const Joi = require('joi')
const flash = require('connect-flash');
const UserSchema = require('./schema/UserSchema');

const signup= require('./routes/signup');
const login = require('./routes/login');
const passport = require('passport');
const LocalStrategy = require('passport-local');


const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
   
}



app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(UserSchema.authenticate()));

passport.serializeUser(UserSchema.serializeUser());
passport.deserializeUser(UserSchema.deserializeUser());



 


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true

});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});






app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
    
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


//routes

app.use('/signup',signup);
app.use('/login', login);




app.listen(3000, () => {
    console.log('Serving on port 3000')
})
