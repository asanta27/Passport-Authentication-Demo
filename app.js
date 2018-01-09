var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local");
    
mongoose.connect("mongodb://localhost/auth_demo_app",  {useMongoClient: true});

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Embrace your own eccentricity!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// localStrategy is passport local mongoose
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ====== Routes =======

// HOME
app.get("/", function(req, res){
    res.render("home");
});

// sign up form
app.get("/register", function(req, res) {
    res.render("register");
});

// handles user sign up
app.post("/register", function(req, res) {
    req.body.username;
    req.body.password;
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err)
            return res.render('register')
        } 
        
        // logs user in
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        });
    });
});

// login form
app.get("/login", function(req, res){
    res.render("login");
});

// handles login
app.post("/login", passport.authenticate("local", {
  successRedirect: "/secret",
  failureRedirect: "/login"
}));

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

// isLoggenIn must return true before viewing secret page
app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
});

// determines if user is logged in
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.ID, function(){
    console.log("|-- Server Started --|");
})