import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartItem } from './entities/cart-item.entity';

import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { Product } from '../product/entities/product.entity';

@Module({
  controllers: [CartController],
  exports: [CartService],
  providers: [CartService],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Cart, CartItem, User, Product]),
  ],
})
export class CartModule {}
