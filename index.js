const express = require("express")
const flash = require("express-flash")
const session = require("express-session")
const { startSession } = require("mongoose")
const passport = require("passport")
const Strategy = require("passport-local").Strategy
const methodoverride = require("method-override")
const app = express()

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
const users= []

app.get("/",checkAuthenticate, (req,res)=>{

    res.render("h", { name : req.user.name, id : req.user.id})
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


app.post("/register",notcheckAuthenticate,  async(req,res)=>{

 try{
       users.push ({
        id: Date.now(),
        name : req.body.name,
        email : req.body.email,
        password : req.body.password
      })
      res.render("login")
 }
 catch(e){
     res.render("register")
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
 (email,password,done)=>{

      const user = users.find(u=>u.email===email)
      if(!user) return done(null,false, {message : "invalid emailId"})

     if(user.password!==password){
         return done(null,false,{message :"invalid password"})
     }
     return done(null,user)
 }))
passport.serializeUser((user,done)=>{

 return done(null,user.id)
})

passport.deserializeUser((id,done)=>{
           
 const u = users.find(u=>u.id===id)
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
