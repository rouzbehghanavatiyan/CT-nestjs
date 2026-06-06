import { Module } from '@nestjs/common';
import { StoreController } from 'src/modules/store/store.controller';
import { StoreService } from './store.service';
import { StoreEntity } from './store.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/modules/store/paymant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreEntity, Payment])],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
