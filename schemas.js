const Joi = require('@hapi/joi'); 
const schemas = { 
  evacueeGroupSchema: Joi.object().keys({ 
    shelterId: Joi.number().required(),
    address: Joi.object().keys({
        street: Joi.string().max(50).required(),
        city: Joi.string().max(50).required(),
        state: Joi.string().max(2).required(),
        zip: Joi.string().max(5).required()
    }),
    evacuees: Joi.array().items(Joi.object().keys({ 
        firstName: Joi.string().max(50).required(),
        lastName: Joi.string().max(50).required(),
        email: Joi.string().max(50).allow(null),
        phone: Joi.string().max(10).allow(null),
        sex: Joi.string().max(1).required(),
        //race: Joi.string().max(50).required(),
        veteran: Joi.string().max(1).allow(null),
        outofstate: Joi.string().max(1).allow(null),
        age: Joi.number().required(),
        covidSymptoms: Joi.string().max(1).allow(null)
        })) 
    })
}; 

module.exports = schemas;