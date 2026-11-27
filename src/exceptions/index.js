export class ClientError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}
export class InvariantError extends ClientError {
  constructor(message) { super(message, 400); }
}
export class NotFoundError extends ClientError {
  constructor(message) { super(message, 404); }
}
export class ConflictError extends ClientError {
  constructor(message) { super(message, 409); }
}
export class AuthenticationError extends ClientError {
  constructor(message) { super(message, 401); }
}
export class AuthorizationError extends ClientError {
  constructor(message) { super(message, 403); }
}
