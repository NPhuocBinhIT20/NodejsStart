const Deck = require('../models/Deck');
const User = require('../models/User')
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


const getDeck = async (req, res, next) => {
   try {
    const deck =  await Deck.findById(req.value.params.deckID)
    return res.status(201).json({Deck: deck})
   } catch (error) {
    next(error);
   }
}

const createDeck = async (req, res,next) => {
    try {
    
    const owner  = await User.findById(req.value.body.owner)
    const deck = req.value.body
    delete deck.owner

    deck.owner = owner._id

    const newDeck = new Deck(deck)
    await newDeck.save()

    owner.decks.push(newDeck._id)
    await owner.save()

    return res.status(200).json({Deck: newDeck});

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
        const decks = await Deck.find({})
        return res.status(200).json({decks: decks}) 
    } catch (error) {
        next(error)
    }
}

const replaceDeck = async (req, res, next) => {
    try {
        const {deckID} = req.value.params
        const newDeck = req.value.body
        const result = await Deck.findByIdAndUpdate(deckID, newDeck)
        return res.status(200).json({success: true}) 
    } catch (error) {
        next(error)
    }
}

const updateDeck = async (req, res, next) => {
   try {
    const {deckID} = req.value.params
    const newDeck = req.value.body
    const result = await Deck.findByIdAndUpdate(deckID, newDeck)
    return res.status(200).json({success: true}) 
   } catch (error) {
    next(error)
   }
}

const deleteDeck = async (req, res, next) => {
    try {
        const { deckID } = req.value.params
    
    //Get a Deck
    const deck = await Deck.findById(deckID)
    const ownerID = deck.owner

    // Get a owner
    const owner = await User.findById(ownerID)
    
    //Remove the deck 

    await deck.deleteOne({ownerID: ownerID})

    // remove deck from owner's deck list

    owner.decks.push(deck)

    // save the owner
    await owner.save()
    
    return res.status(200).json({success: true})


    } catch (error) {
        next(error)
    }

}
module.exports = {
    createDeck,
    getDeck,
    getAll,
    replaceDeck,
    updateDeck,
    deleteDeck
}