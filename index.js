if(process.env.NODE_ENV !== "production")
{
	require('dotenv').config();
}
var express 		= require("express"),
	mongoose 		= require("mongoose"),
	passport 		= require("passport"),
	LocalStrategy 	= require("passport-local").Strategy,
	app 			= express();

var theatreRoutes = require("./routes/index")
var User = require('./models/user')
//Db connection

mongoose.connect(process.env.DBURL, {useNewUrlParser: true, useUnifiedTopology: true,  useCreateIndex: true})
    .then(()=>{
        console.log("Db connected");
    })
    .catch(err=>{
        console.log(err);
    })

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))
const session = require("express-session")({
	secret: "Love Towards Travel",
	resave: false,
	saveUninitialized: false
});
app.use(session);
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy({usernameField: 'email',},User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(theatreRoutes);

app.listen(process.env.PORT || 4000, function(){
	console.log("Cinema Universe...!");
})