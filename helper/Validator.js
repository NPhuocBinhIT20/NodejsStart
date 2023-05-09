const Joi = require('@hapi/joi')


const ValidatorBody = (schema) =>{
    return (req, res, next) =>{
        const ValidatorResult = schema.validate(req.body)
        if(ValidatorResult.error){
            return res.status(400).json({message:ValidatorResult.error})
        } else {
            if(!req.value) req.value = {}
            if(!req.value['params']) req.value.params = {}
            req.value.body = ValidatorResult.value

            next()
        }
    }
}

const ValidatorParams = (schema, name)=>{
    return (req, res, next) => {
        console.log('ValidatorResult: ',req.params[name])
        const ValidatorResult = schema.validate({param: req.params[name]})
        console.log('ValidatorResult: ',ValidatorResult)
    
        if(ValidatorResult.error){
            return res.status(400).json({message:ValidatorResult.error})
        } else {
            if(!req.value) req.value = {}
            if(!req.value['params']) req.value.params = {}

            req.value.params[name]= req.params[name]
            next()
        }
    }          
}

const schemas = {

    authSignUpSchema: Joi.object().keys({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }),

    authSignInSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }),
    
    deckSchema: Joi.object().keys({
        name: Joi.string().min(6).required(),
        description: Joi.string().min(10).required(),
    }),

    deckOptionalSchema: Joi.object().keys({
        name: Joi.string().min(6),
        description: Joi.string().min(10),
        owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
    }),

    newDeckSchema: Joi.object().keys({
        name: Joi.string().min(6).required(),
        description: Joi.string().min(10).required(),
        owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),

    idSchema: Joi.object().keys({
        param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),

    userSchema: Joi.object().keys({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        email: Joi.string().email().required()
    }),
    
    // optinal for updateUser
    userOptionalSchema: Joi.object().keys({
        firstName: Joi.string().min(2),
        lastName: Joi.string().min(2),
        email: Joi.string().email()
    })


}

module.exports = {
    ValidatorBody,
    ValidatorParams,
    schemas
}