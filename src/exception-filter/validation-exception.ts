import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';
import mongoose from 'mongoose';

Catch(mongoose.Error.ValidationError);
export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: mongoose.Error.ValidationError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        console.log('-------------- VALIDATION -----------------');
        const error: { statusCode: number; message: string | string[] } = {
            statusCode: HttpStatus.BAD_REQUEST,
            message: exception.message,
        };

        if (exception.errors) {
            const message = [];
            for (const key in exception.errors) {
                if (exception.errors.hasOwnProperty(key)) {
                    const element = exception.errors[key];
                    message.push(
                        `value '${element.value}' is invalid for field '${key}'`,
                    );
                }
            }
            error.message = message;
        }

        if (exception['response']?.message) {
            console.log('HERE');
            error.statusCode = exception['response'].statusCode;
            error.message = exception['response'].message;
        }
        console.log({ status: error.statusCode, error });
        response.status(error.statusCode).json(error);
    }
}
