import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MongooseExceptionFilter } from './exception-filter/mongoose-exception';
import { ConfigService } from '@nestjs/config';
import { ValidationExceptionFilter } from './exception-filter/validation-exception';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api', { exclude: [] });

    app.useGlobalFilters(new ValidationExceptionFilter());
    app.useGlobalFilters(new MongooseExceptionFilter());
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );

    const configService = new ConfigService();
    if (configService.get('NODE_ENV') === 'development') {
        const config = new DocumentBuilder()
            .addBearerAuth(undefined, 'default')
            .setTitle('Osbash')
            .setDescription('The Osbash API description')
            .setVersion('1.0')
            .build();
        const document = SwaggerModule.createDocument(app, config);

        SwaggerModule.setup('api', app, document, {
            swaggerOptions: {
                authAction: {
                    default: {
                        name: 'default',
                        schema: {
                            description: 'Default',
                            type: 'http',
                            in: 'header',
                            scheme: 'bearer',
                            bearerFormat: 'JWT',
                        },
                        value: configService.get('TOKEN'),
                    },
                },
            },
        });
    }

    await app.listen(3000);
}
bootstrap();
