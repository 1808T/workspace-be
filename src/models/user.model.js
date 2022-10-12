import Joi from 'joi';

const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(32).required(),
  email: Joi.string()
    .trim()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,32}$')).required(),
  repeatPassword: Joi.ref('password'),
  fullName: Joi.string().alphanum().min(3).max(32).required(),
  avatar: Joi.string().default(null),
  boardList: Joi.array().items(Joi.string()).default([]),
  friends: Joi.array().items(Joi.string()).default([]),
  isActive: Joi.boolean().default(false),
  isAdmin: Joi.boolean().default(false),
  createdAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
});

export default userSchema;
