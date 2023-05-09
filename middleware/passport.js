const passport = require('passport')
const { Strategy:JwtStrategy, ExtractJwt} = require('passport-jwt');
const { JWT_SECRET } = require('../config/index')
const { Strategy:LocalStrategy } = require('passport-local')


const User = require('../models/User')


passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization') ,
  secretOrKey: JWT_SECRET
}, async (payload, done)=>{
    try {
      const user = await User.findById(payload.sub)

      if(!user) return done(null, false)

      done(null, user)
    } catch (error) {
      done(error, false)
    }
}))

// passport local

passport.use(new LocalStrategy({
  usernameField: 'email',
}, async (email, password, done)=>{
 try {
  const user = await User.findOne({email: email});

  if(!user) return done(null, false)

  const isCorrectPassword = await user.isValidPassword(password);
  
  if(!isCorrectPassword) return done(null, false)
  
  done(null, user)
 } catch (error) {
  done(error. false)
 }
}))