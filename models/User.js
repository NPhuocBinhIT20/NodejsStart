const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcryptjs'); 

const userSchema = new Schema({
    firstName: {
        type: String ,
    },
    lastName: { 
        type: String ,

    },
    email: {
        type: String ,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String ,
        required: true,
    },
    decks:[{
        type: Schema.Types.ObjectId,
        ref: 'Deck'
    }]
})

userSchema.pre('save', async function (next) {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10)
    // Generate password hash ( salt + hash)
    const passwordHashed = await bcrypt.hash(this.password, salt)

    //Re-asgin password hashed
    this.password = passwordHashed
    
    next()
  } catch (error) {
    next(error);
  }
})

userSchema.methods.isValidPassword = async function(newPassword) {
   try {
      return await bcrypt.compare(newPassword, this.password)
      
   } catch (error) {
    throw new Error(error);
   }
}


const User = mongoose.model('User', userSchema)
module.exports = User