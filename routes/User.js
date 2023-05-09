const express = require('express');
const router = express.Router();
const { ValidatorBody, ValidatorParams, schemas } = require('../helper/Validator')


const passport = require('passport');
const passportConfig = require('../middleware/passport')

const userController = require('../controllers/User')

    router.route('/')
        .get(userController.getAll)
        .post(ValidatorBody(schemas.userSchema),userController.createUser)

    router.route('/signup')
        .post(ValidatorBody(schemas.authSignUpSchema),userController.signUp)

    router.route('/signin')
        .post(ValidatorBody(schemas.authSignInSchema), passport.authenticate('local', { session: false }), userController.signIn)

    router.route('/secret')
        .get(passport.authenticate('jwt', { session: false }),userController.secret)

    router.route('/:userID')
        .get(ValidatorParams(schemas.idSchema, 'userID'), userController.getUser)
        .put(ValidatorParams(schemas.idSchema, 'userID'), ValidatorBody(schemas.userSchema) ,userController.replaceUser)
        .patch(ValidatorParams(schemas.idSchema, 'userID'), ValidatorBody(schemas.userOptionalSchema) , userController.updateUser)

    router.route('/:userID/decks')
        .get( ValidatorParams(schemas.idSchema, 'userID') , userController.getUserDecks)
        .post( ValidatorBody(schemas.userSchema), ValidatorBody(schemas.deckSchema), userController.newUserDeck)

module.exports = router;

