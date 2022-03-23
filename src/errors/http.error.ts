export class HttpException extends Error {
  constructor(
    public code: number,
    public msg: string,
    public params: any = {},
  ) {
    super(msg);
  }
}

export class BadRequestException extends HttpException {
  constructor(msg) {
    super(400, msg);
  }
}
export class InternalServerException extends HttpException {
  constructor(msg) {
    super(500, msg);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(msg) {
    super(401, msg);
  }
}

export class ForbiddenException extends HttpException {
  constructor(msg) {
    super(403, msg);
  }
}

export class NotFoundException extends HttpException {
  constructor(msg) {
    super(404, msg);
  }
}

export class UnprocessableEntityException extends HttpException {
  constructor(msg, params) {
    let p = params;
    if (!Array.isArray(p)) {
      p = [params];
    }
    super(422, msg, p);
  }
}
