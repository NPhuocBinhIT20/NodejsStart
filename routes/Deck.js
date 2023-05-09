const express = require('express');
const router = express.Router();
const { ValidatorBody, ValidatorParams, schemas } = require('../helper/Validator')

const DeckController = require('../controllers/Deck')

    router.route('/')
        .get(DeckController.getAll)
        .post( ValidatorBody(schemas.newDeckSchema) ,DeckController.createDeck)
    router.route('/:deckID')
        .get(ValidatorParams(schemas.idSchema, 'deckID'), DeckController.getDeck)
        .put(ValidatorParams(schemas.idSchema, 'deckID'), ValidatorBody(schemas.newDeckSchema), DeckController.replaceDeck)
        .patch(ValidatorParams(schemas.idSchema, 'deckID'), ValidatorBody(schemas.deckOptionalSchema), DeckController.updateDeck)
        .delete(ValidatorParams(schemas.idSchema, 'deckID'), DeckController.deleteDeck)



    

module.exports = router;

