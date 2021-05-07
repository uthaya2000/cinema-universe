const express = require('express');
const route = express.Router();
const User = require('../models/user'),
      Theatre = require('../models/theatre'),
      BookedSeat = require('../models/seats')
const passport = require('passport')
const middleware = require('../middlewares/index');
const qrcode = require('qrcode')
const nodemailer = require("nodemailer");

route.get('/',middleware.isLoggedIn, async(req, res)=>{

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    let date = yyyy + '-' + mm + '-' + dd;

    await BookedSeat.deleteMany({date : {$lte: date}})

    var data = await Theatre.find();
    var theatres = new Array();
    data.forEach(place=>{
        theatres.push(place.city);
    })
    theatres = [...new Set(theatres)]
    res.render('city', {theaters: theatres});
})
route.get("/price", async(req, res)=>{
    const name = await Theatre.findOne({name: req.query.id})
    console.log(name.price)
    res.send(name.price)
})
route.get('/theater/:city',middleware.isLoggedIn, async(req, res)=>{
    let data = await Theatre.find({city: req.params.city})
    res.render("theater", {movies: data});
})

route.get("/book/:id",middleware.isLoggedIn, async(req, res)=>{
    const data = await Theatre.findById(req.params.id);
    var bookedseats = new Array();
    var bn = await BookedSeat.find({theatre: data.name, city: data.city});
    var today = new Date();
    var dd = String(today.getDate()+1).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    let date = yyyy + '-' + mm + '-' + dd;
    if(bn!= null)
    {
        bn.forEach(bon=>{
            bookedseats = bookedseats.concat(bon.seatNo);
        })
       return res.render("booking", {movie: data, booked: bookedseats, date: date})
    }
    res.render("booking", {movie: data, booked: undefined, date:date});
})

route.post("/checkout",middleware.isLoggedIn, (req, res)=>{
    var qrc, userid;
    userid = req.user._id;
    qrcode.toDataURL(userid.toString(), (err, url)=>{
        if(err)
        {
            console.log(err)
        }else
        {
            var data = {
                theatre: req.body.theater,
                seatNo: req.body.seats,
                user: req.user._id,
                city: req.body.city,
                movie: req.body.movie,
                qr: url,
                date: req.body.date,
                price: req.body.price
            }
            BookedSeat.create(data, (err, booked)=>{
                if(err)
                {
                    console.log(err)
                }else
                {
                    let m = ""
                    for(let i=0;i<booked.seatNo.length;i++)
                    {
                        m += " "+booked.seatNo[i]; 
                    }
                    var msg = `<b>Hi, ${req.user.username}</b> 
                    <p>Seats: ${m} </p>
                    <p>Theater and City: ${booked.theatre} and ${booked.city}</p>
                    <p>Price : ${booked.price}</p>`
                    var transporter = nodemailer.createTransport({
                        service: 'hotmail',
                        auth: {
                          user: process.env.MAILID,
                          pass: process.env.MAILPASS
                        }
                      });
                      var mailOptions = {
                        from: process.env.MAILID,
                        to: req.user.email,
                        subject: 'Booked Success fully',
                        text: JSON.stringify(booked),
                        html: msg
                      };
                      
                      transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                        }
                      });
                    res.send(booked)
                }
            })
        }
    })
})
route.get("/del/:id", async(req, res) => {
    const data = await BookedSeat.findByIdAndRemove(req.params.id)
    if(data)
    {
        res.redirect("/myorders");
    } else {
        res.redirect("/");
    }
})
route.get("/login", (req, res)=>{
    res.render("login", {msg: req.query.msg})
})

route.get("/signup", (req, res)=>{
    res.render('signup', {msg: req.query.msg});
})

route.post('/signup', (req, res)=>{
    if(req.body.password != req.body.cpassword)
    {
        return res.redirect('/signup?msg=Password did not match');
    }
    var data ={
        email: req.body.email,
        username: req.body.email
    }
    User.register(new User(data), req.body.password, function(err,user){
		if(err){
			console.log(err)
			return res.redirect("/signup")
		}
		passport.authenticate("local")
		(req,res,function(){
			res.redirect("/");
		})
	})
})
route.get("/myorders", middleware.isLoggedIn, async(req, res)=>{
    const curuser = req.user;
    const data = await BookedSeat.find({user: curuser._id})
    res.render("myorders", {data: data})
})
route.post("/login", passport.authenticate('local', {successRedirect: '/',failureRedirect: '/login?msg=Incorrect Username or password' }), (req, res)=>{
})

route.get('/logout', (req, res)=>{
    req.logOut();
    res.redirect('/');
})

route.get('/sample',  middleware.checkAdmin,(req, res)=>{
    res.render('form')
})
route.post('/sample', middleware.checkAdmin,(req, res)=>{
    var data = {
        name: req.body.name,
        city: req.body.city,
        movie: req.body.movie,
        mposter: req.body.mposter,
        tposter: req.body.tposter,
        address: req.body.address,
        price: req.body.price
    }
    var seatt = new Array();
        for(let i = 0;i<10;i++)
        {
            for(let j=0;j<10;j++)
            {
                var r = String.fromCharCode(65+i);
                seatt.push(r+j)
            }
        }
    data.seats = seatt;
    Theatre.create(data, (err, place)=>{
        if(err)
        {
            console.log(err)
        }
        else
        {
            res.redirect('/sample');
        }
    })
})

module.exports = route;