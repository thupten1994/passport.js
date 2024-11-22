const express = require("express")
const flash = require("express-flash")
const sessions = require("express-session")
const passport = require("passport")
const Strategy = require("passport-local").Strategy

const app = express()



const users = []
app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(sessions({
          secret : "mm",
          resave:false,
          saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
app.get("/", (req,res)=>{

  res.render("index.ejs")
})
app.get("/login",(req,res)=>{

  res.render("login.ejs")
})
app.get("/register",(req,res)=>{

  res.render("register.ejs")
})

app.post("/register",(req,res)=>{

  try{
    users.push({
        id: Date.now(),
        name : req.body.name,
        email : req.body.email,
        password : req.body.password}   
   )
   console.log(users)
   res.render("login")
}
catch(e){
    res.render("register")
}


})

app.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true // This triggers flash messages on failure
}))

passport.use( 
  new Strategy({usernameField : "email",
    passwordField : "password"
  }
  , (email,password,done)=>{
  
    
   console.log("checking password")
   const user =  users.find(u=>u.email===email)
  if(!user) return done(null,false, {message : "not a valid user with this email"})
  
  if(user.password!== password){
    return done( null,false, {message : "wrong password"})
  }
    console.log("correct password")
    return done(null, user)
}) )

passport.serializeUser((user,done)=>{
  
  return done(null,user.id)
})

passport.deserializeUser((id,done)=>{

       const user= users.find(u=>u.id===id)
  return done(null,user)
})



app.listen(2000)