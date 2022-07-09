const express = require('express');
const app = express();
const path = require('path')
const session = require('express-session')
const ejsMate = require('ejs-mate')
const flash = require('connect-flash');
const UserSchema = require('./schema/UserSchema');
const methodOverride = require('method-override');
const signup = require('./routes/signup');
const login = require('./routes/login');
const passport = require('passport');
const LocalStrategy = require('passport-local');







//connecting database

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/fake-data', {
    useNewUrlParser: true,
    useUnifiedTopology: true

});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


//session

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,

}

app.use(session(sessionConfig))
app.use(flash());



//passport middlewares

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(UserSchema.authenticate()));


passport.serializeUser(UserSchema.serializeUser());
passport.deserializeUser(UserSchema.deserializeUser());

//other middlewares

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));



app.use((req, res, next) => {

    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})







//routes
app.get("/", (req, res) => {
    res.render('landingPage');
});


app.use('/signup', signup);
app.use('/login', login);



//listen

app.listen(3000, () => {
    console.log('Serving on port 3000')
})
