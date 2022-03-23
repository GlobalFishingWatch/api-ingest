import { CONSTANTS } from './constants';

type Message = {
  title: string;
  detail: string;
};

export class HttpStandardException extends Error {
  constructor(
    public statusCode: number,
    public error: string,
    public messages: Message[] = [],
  ) {
    super('');
  }
}

export class UnauthorizedStandardException extends HttpStandardException {
  constructor(message) {
    const messages = [
      {
        title: CONSTANTS.errors.unauthorized,
        detail: message,
      },
    ];
    super(
      CONSTANTS.statusCodes.unauthorized,
      CONSTANTS.errors.unauthorized,
      messages,
    );
  }
}

export class ForbiddenStandardException extends HttpStandardException {
  constructor(msg) {
    const messages = [
      {
        title: CONSTANTS.errors.forbidden,
        detail: msg,
      },
    ];
    super(
      CONSTANTS.statusCodes.forbidden,
      CONSTANTS.errors.forbidden,
      messages,
    );
  }
}

export class NotFoundStandardException extends HttpStandardException {
  constructor(message) {
    const messages = [
      {
        title: CONSTANTS.errors.notFound,
        detail: message,
      },
    ];
    super(CONSTANTS.statusCodes.notFound, CONSTANTS.errors.notFound, messages);
  }
}

export class UnprocessableEntityStandardException extends HttpStandardException {
  constructor(messages: Message[]) {
    super(
      CONSTANTS.statusCodes.unprocessableEntity,
      CONSTANTS.errors.unprocessableEntity,
      messages,
    );
  }
}

export class ServerUnavailableException extends HttpStandardException {
  constructor(message) {
    const messages = [
      {
        title: CONSTANTS.errors.serviceUnavailable,
        detail: message,
      },
    ];
    super(
      CONSTANTS.statusCodes.serviceUnavailable,
      CONSTANTS.errors.serviceUnavailable,
      messages,
    );
  }
}
