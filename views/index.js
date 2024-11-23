const express = require("express")
const flash = require("express-flash")
const session = require("express-session")
const passport = require("passport")
const Strategy = require("passport-local").Strategy
const methodoverride = require("method-override")
const app = express()
const User = require("./model/user")
const mongoose = require("mongoose")


mongoose.connect("mongodb://localhost:27017")
        .then(()=>{console.log(" connected to mongodb")})
        .catch(e=>{console.log(e)})


app.use(express.json())
app.set("view engine", "ejs")

app.use(express.urlencoded({extended: true}))
app.use(session({
    secret : "mysecrestKey",
    resave : false,
    saveUninitialized : false,
    cookie :{
        maxAge : 1000*60
    }
}))
app.use(methodoverride("_method"))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodoverride("_method"))

app.get("/",checkAuthenticate, (req,res)=>{

    res.render("home", { name : req.user.name, id : req.user.id})

})

app.get("/login",notcheckAuthenticate,(req,res)=>{

 res.render("login")
})



app.get("/register",notcheckAuthenticate,(req,res)=>{
 res.render("register")
})


app.post("/login",notcheckAuthenticate,passport.authenticate("local",{
 successRedirect : "/",
 failureRedirect :"/login",
 failureFlash: true
}))


app.post("/register",notcheckAuthenticate,async(req,res)=>{
    

 try{

    const user = new User({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password
    })
      
      console.log(await user.save())
        return  res.render("login")
 }
 catch(e){
     res.render("register",{message : " user already in use"})
 }

})

app.delete("/logout",(req,res)=>{
 req.logout(function(err) {
     if (err) {
         return next(err);  // Handle the error if any
     }
     res.redirect('/');  // Redirect after successful logout
 });
})
passport.use( 
 new Strategy({ 
     usernameField : "email",
     passwordField : "password"
 },
 async(email,password,done)=>{
     
     console.log(email)
      const user =  await User.findOne({email:email})
      if(!user) return done(null,false, {message : "Invalid email Id"})

        console.log(` this is password ${user.password}`)
     if(user.password!==password){
         return done(null,false,{message :"invalid password"})
     }
     return done(null,user)
 }))
passport.serializeUser((user,done)=>{

 return done(null,user.id)
})

passport.deserializeUser(async(id,done)=>{
           
 const u =  await User.findOne({_id : id})
  return done(null,u)
})



function checkAuthenticate(req,res,next){

 if(req.isAuthenticated()){
     return next()
 }
 return  res.redirect("/login")
 
}
function notcheckAuthenticate(req,res,next){

 if(req.isAuthenticated()){
     return res.redirect("/")
 }
  next()
}
app.listen(9000)