
const LocalStartegy = require("passport-local")
const bcrypt = require("bcrypt")


function initialize(passport){
    passport.use( new LocalStartegy ({usernameField : "email"}, authenticateUser))
    passport.serializeUser((user,done)=>{})
    passport.deserializeUser()

}


    const authenticateUser = async (email,password,done)=>{

        const user = getUserByEmail(email)
        if(!user) return done( null, false, {message : "no user with this email"})

        try {
            if( await bcrypt.compare(password,user.passport)){

            }
            else {
                return done ( null , false , { message : " wrong password"})
            }       
        
        }
        catch(e){ 
            done(e)
        }

     
    }
module.exports= initialize