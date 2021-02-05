import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { CreateCartDto, CreateCartWithUserDto } from './dto/create-cart.dto';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';

import { Product } from '../product/entities/product.entity';

const productToProductEntity = (product: any, cartId: number): any => ({
  ...product,
  cartId,
});
@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,

    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    private readonly userService: UsersService,
  ) {}

  async createCart(createCartDto: CreateCartWithUserDto): Promise<any> {
    const { user, product } = createCartDto;
    const cart = await this.cartRepository.create({ user });
    await this.cartRepository.save(cart);

    const cartItems = this.cartItemRepository.create(
      productToProductEntity(product, cart.id),
    );
    await this.cartItemRepository.save(cartItems);
    return cart;
  }

  async updateCart(createCartDto: CreateCartDto, cart: Cart): Promise<any> {
    const { product } = createCartDto;
    const productInDb = await this.productRepository.findOne({
      id: product.productId,
    });

    if (!productInDb) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    const itemInDb = await this.cartItemRepository.findOne({
      where: { productId: product.productId },
    });
    if (product.quantity === 0) {
      throw new HttpException('Not implemented', HttpStatus.NOT_IMPLEMENTED);
    } else {
      itemInDb.quantity = product.quantity;
      await this.cartItemRepository.save(itemInDb);
      const index = cart.items.findIndex((item) => item.id === itemInDb.id);
      cart.items[index] = itemInDb;
    }
    return cart;
  }

  async manipulateCart(createCartDto: CreateCartWithUserDto): Promise<any> {
    const { user } = createCartDto;
    const userInDb = await this.userService.findById(user);
    if (!userInDb) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    let cart = await this.cartRepository.findOne({
      where: { user },
      relations: ['items', 'items.productId'],
    });
    if (cart) {
      cart = await this.updateCart(createCartDto, cart);
    } else {
      cart = await this.createCart(createCartDto);
    }
    return cart;
  }
}
