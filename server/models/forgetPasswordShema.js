const Joi = require("joi");

 const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "L'email est requis",
    "string.email": "L'email doit être valide",
  }),
});

module.exports =forgotPasswordSchema; 