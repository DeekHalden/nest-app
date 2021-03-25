import { Body, Controller, Get, Inject, Post, Session } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDecorator } from '../common/decorators/user.decorator';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart } from './entities/cart.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { get } from 'http';
import { RoleDecorator } from 'src/common/decorators/role.decorator';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
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
    @Session() session,
  ): Promise<Cart> {
    console.log(body);
    if (user) {
      return await this.cartService.manipulateCart({ ...body, user: user.id });
    }
    if (!session.cart) {
      session.cart = [];
    }
    session.cart.push(body);
  }

  @RoleDecorator()
  @Get('/')
  async getUserCart(
    @UserDecorator() user,
    @Session() session,
  ): Promise<CreateCartItemDto[]> {
    console.log(user);
    let cart;
    cart = session.cart || [];
    if (user) {
      cart = await (await this.cartService.getCart(user.id)).items;
    }
    return cart;
  }
}
