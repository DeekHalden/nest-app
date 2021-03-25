import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { CreateCartDto, CreateCartWithUserDto } from './dto/create-cart.dto';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';

import { Product } from '../product/entities/product.entity';
import { CreateCartItemDto } from './dto/create-cart-item.dto';

const productToProductEntity = (
  product: any,
  cartId: number,
): CreateCartItemDto => ({
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

  async getCart(user: number) {
    const cart = await this.cartRepository.findOne({
      where: { user },
      relations: ['items', 'items.productId', 'items.productId.images'],
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }

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
    console.log(cart);
    const { product } = createCartDto;
    const productInDb = await this.productRepository.findOne({
      id: product.productId,
    });

    if (!productInDb) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    const itemInCart = await this.cartItemRepository.findOne({
      where: { productId: product.productId },
    });

    if (itemInCart) {
      if (product.quantity === 0) {
        throw new HttpException('Not implemented', HttpStatus.NOT_IMPLEMENTED);
      } else {
        itemInCart.quantity += product.quantity;
        await this.cartItemRepository.save(itemInCart);
        const index = cart.items.findIndex((item) => item.id === itemInCart.id);
        console.log(itemInCart);
        cart.items[index] = itemInCart;
      }
    } else {
      const cartItem = await this.cartItemRepository.create(
        productToProductEntity(createCartDto.product, cart.id),
      );
      await this.cartItemRepository.save(cartItem);
      const { quantity, id } = cartItem;
      cart.items.push({ quantity, id });
    }
    return cart;
  }

  async manipulateCart(createCartDto: CreateCartWithUserDto): Promise<any> {
    const { user } = createCartDto;
    const userInDb = await this.userService.findById(user);
    if (!userInDb) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    let cart: Cart = await this.cartRepository.findOne({
      where: { user },
      relations: ['items'],
    });
    if (cart) {
      cart = await this.updateCart(createCartDto, cart);
    } else {
      cart = await this.createCart(createCartDto);
    }
    return cart;
  }
}
