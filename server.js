const express = require("express")
const Strategy = require("passport-local").Strategy
const session = require("express-session")

const app = express()
const passport = require("passport")
const users = []

app.set("view engine", "ejs")
app.use(express.urlencoded({extended: false}))

app.use(session({
    secret : "my secrectkey",
    resave : false,
    saveUninitialized : false

}))
   //app.use(passport.initialize())
//app.use(passport.session ())

app.get("/",(req,res)=>{
     res.render("index.ejs")
})
app.get("/login",(req,res)=>{
    res.render("login.ejs")
})
app.get("/register",(req,res)=>{
    res.render("register.ejs")
})

app.post("/login",passport.authenticate("local",{
    successRedirect : "/",
    failureRedirect : "/register"
}))


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



passport.use(
     new Strategy( 
        {usernameField : "email",
          passwordField : "password"
        }, 
        ( email,password,done)=>{

                 const user =  users.find(u=>u.email===email)
                 console.log(user)
                 if(!user){
                    return done(null,false,{message : " no email with this user"})
                 }
                 if(user.password!==password) {
                    console.log("wrong password")
                    return done(null,false,{message : "wrong password"})

                 }
                
                    return done(null,user)
            
        }
    
    ) )

    passport.serializeUser((user,done)=>{
        done(null, user.id)
    })
    passport.deserializeUser((id,done)=>{
        
        const user = users.find(u=>u.id===id)
        
        done(null,user)

    })


app.listen(3000, ()=>{console.log("Listening to port 3000")})