import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  controllers: [CartController],
  exports: [CartService],
  providers: [CartService],
  imports: [TypeOrmModule.forFeature([Cart])],
})
export class CartModule {}
