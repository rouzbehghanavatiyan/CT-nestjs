import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SUCCESS_MESSAGE } from '../decorators/success-message.decorator';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const customMessage =
      this.reflector.get<string>(SUCCESS_MESSAGE, context.getHandler()) ||
      'عملیات با موفقیت انجام شد';

    return next.handle().pipe(
      map((data) => ({
        statusCode: HttpStatus.OK,
        code: 0,
        message: customMessage,
        data: data ?? null,
      })),
    );
  }
}
