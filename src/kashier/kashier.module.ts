import { Module } from '@nestjs/common';
import { KashierService } from './kashier.service';
import { KashierController } from './kashier.controller';

@Module({
    controllers: [KashierController],
    providers: [KashierService],
    exports: [KashierService],
})
export class KashierModule {}
