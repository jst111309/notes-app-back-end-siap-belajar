import { InvariantError } from '../exceptions/index.js';
export default function validate(schema) {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return next(new InvariantError(error.details.map((d) => d.message).join('; ')));
    req.validated = value;
    return next();
  };
}
