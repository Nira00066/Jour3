import Joi from "joi";

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'L\'email est requis',
    'string.email': 'L\'email doit être valide'
  })
});
