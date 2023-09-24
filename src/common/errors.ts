import { HttpException, HttpStatus } from '@nestjs/common';

export class CommonError extends HttpException {
  constructor({ message, status }: { message: string; status?: HttpStatus }) {
    super(message, status || 400);
  }
}
