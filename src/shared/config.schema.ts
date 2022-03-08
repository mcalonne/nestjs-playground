import Joi from 'joi';

export const configValidationSchema = Joi.object({
    DB_TYPE: Joi.string().default('mysql'),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(3306),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_DATABASE: Joi.string().default('crypto-management'),
    JWT_SECRET: Joi.string().required(),
});