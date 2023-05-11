const Deck = require('../models/Deck');
const User = require('../models/User')

const {JWT_SECRET} = require('../config/index')
const JWT = require('jsonwebtoken')


const encodedToken = (userID) =>{
    return JWT.sign({
      iss: 'Phuoc Binh',
      sub: userID,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 3)
    }, JWT_SECRET)
}

// Promise way on createUser
// const createUser = (req, res,next) => {
//     console.log('createUser', req.body)
//     const newUser = new User(req.body)
//     console.log('newUser', newUser)
//     newUser.save().then(data => {    
//         // console.log('User save: ', data)
//         return res.status(201).json({data: data});
//     }).catch((err) => {
//         next(err);
//     })
// }


// async await way on Create User

const createUser = async (req, res,next) => { 
    try {
    const newUser = new User(req.value.body)
    await newUser.save()   
    return res.status(201).json({user: newUser});
    } catch (error) {
        next(error);
    }
}
// Promise way

// const getAll = (req, res, next) => {
//     // callback
//     User.find({}).then(data => {
//         //  console.log('User found', data);
//          return res.status(200).json({data: data});
//         }).catch((err)=>{
//         next(err);
//     })
    
//     // return res.status(200).json({
//     //     message: 'User successfully'
//     // })
// }



// async await way on GetAll User
const getAll = async (req, res, next) => {
    try {
    const users = await User.find({})
        return res.status(200).json({users: users});
    } catch (error) {
        next(error)
    }
}
// Get User By ID .......FindByID
const getUser = async (req, res, next) => {
    try {
        const { userID } = req.value.params

        const user = await User.findById(userID);

        return res.status(201).json({user: user});
    } catch (error) {
        next(error);
    }
}   

const replaceUser = async (req, res, next) => {
    // enforce new user to old user state
    
    const {userID} = req.value.params
    
    const newUser = req.value.body

    const result = await User.findByIdAndUpdate(userID, newUser)
    
    return res.status(200).json({success: true}) 
}

const updateUser = async (req, res, next) => {
    // number of fiels

    const {userID} = req.value.params
    
    const newUser = req.value.body

    const result = await User.findByIdAndUpdate(userID, newUser)
    
    return res.status(200).json({success: true}) 
}

const getUserDecks = async (req, res, next) => {
    const {userID} = req.value.params

    const user = await User.findById(userID).populate('decks')

    return res.status(200).json({user: user})
}

const newUserDeck = async (req, res, next) => {
    try {
    
    const {userID} = req.value.params
    // create a newDeck
    const newDeck = new Deck(req.value.body)
    // Get User
    const user = await User.findById(userID)

    //assign user as a deck owner
    newDeck.owner = user
    // save newDeck
    await newDeck.save()

    // add deck to user's decks array deck
    user.decks.push(newDeck._id)
    // save the user
    await user.save()
    //
    return res.status(200).json({Deck: newDeck});

    } catch (error) {
        next(error);
    }
}

const signIn = async (req, res, next) => {S
    const token = encodedToken(req.user._id)
    res.setHeader('Authorization', token)
    return res.status(200).json({success: true})

}
const signUp = async (req, res, next) => {
    const {firstName, lastName, email, password} = req.value.body

    //check if there is a user with the some user 
    const foundUser = await User.findOne({ email: email })
    if(foundUser) return res.status(403).json({error : {
      message: "Email already in user different"
    }})
    
    // create new user
    const newUser = new User({firstName, lastName, email, password})
    await newUser.save()

    // encode to token

    const token = encodedToken(newUser._id)

    res.setHeader('Authorization', token)
    return res.status(201).json({success: true})
}
const secret = async (req, res, next) => {
    return res.status(200).json({ resources: true})
}

module.exports = {
    createUser,
    getAll,
    getUser,
    getUserDecks,
    newUserDeck,
    replaceUser,
    updateUser,
    signIn,
    signUp,
    secret                 
    
}