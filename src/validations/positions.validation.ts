import * as Koa from 'koa';
import * as Joi from '@hapi/joi';

const {
  errors: { UnprocessableEntityException },
} = require('auth-middleware');

const schema = Joi.array().items(
  Joi.object({
    id: Joi.string()
      .required(),
    lat: Joi.number()
      .min(-90)
      .max(90)
      .strict()
      .required(),
    lon: Joi.number()
      .min(-180)
      .max(180)
      .strict()
      .required(),
    timestamp: Joi.date()
      .iso()
      .required(),
    extraInfo: Joi.object(),
  }),
);

export async function validatePositions(body: any[]) {
  try {
    await schema.validateAsync(body);
  } catch (err) {
    throw new UnprocessableEntityException('Invalid body', err.details);
  }
}
