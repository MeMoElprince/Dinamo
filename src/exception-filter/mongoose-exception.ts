import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';

@Catch(mongoose.mongo.MongoServerError)
export class MongooseExceptionFilter implements ExceptionFilter {
    catch(exception: MongoServerError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let error: { statusCode: number; message: string | string[] };
        console.log(exception);
        console.log(exception.keyValue);
        console.log(exception.code);
        switch (exception.code) {
            case 11000: {
                error = {
                    statusCode: HttpStatus.NOT_ACCEPTABLE,
                    message: Object.keys(exception.keyValue).map(
                        (key) => exception.keyValue[key] + ' already exists',
                    ),
                };
                break;
            }

            default: {
                console.log(
                    '<-----------------------( MONGOOSE EXCEPTION )----------------------->',
                );
                console.log(exception);
                console.log(
                    '<-----------------------( ------------------ )----------------------->',
                );
                error = {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Internal server error',
                };
                break;
            }
        }

        response.status(error.statusCode).json(error);
    }
}
