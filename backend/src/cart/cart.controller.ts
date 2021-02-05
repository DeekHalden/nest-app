import { Body, Controller, Inject, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDecorator } from '../common/decorators/user.decorator';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart } from './entities/cart.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Public } from '../common/decorators/public.decorator';
@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  @Public()
  @Post('create')
  async create(
    @Body() body: CreateCartDto,
    @UserDecorator() user,
    @Req() req,
  ): Promise<Cart> {
    console.log(user);
    if (user) {
      return await this.cartService.manipulateCart({ ...body, user: user.id });
    }
    if (!req.session.cart) {
      req.session.cart = [];
    }
    req.session.cart.push(body);
  }
}
