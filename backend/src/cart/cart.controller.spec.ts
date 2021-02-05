import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../product/entities/product.entity';
import { Cart } from './entities/cart.entity';
import { Role } from '../roles/entities/role.entity';
import { User } from '../users/entities/user.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import * as mocks from 'node-mocks-http';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({});

describe('CartController', () => {
  let controller: CartController;
  let cartService: CartService;
  let usersService: UsersService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        CartService,
        UsersService,
        {
          provide: getRepositoryToken(Cart),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(CartItem),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Product),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Role),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    cartService = module.get<CartService>(CartService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create', () => {
    it('if user is authenticated should add products to cart', () => {});
    it('otherwise it should add products to session storage', async () => {
      const response = {
        headers: {
          post: jest.fn(() => ''), // do what ever `get` should to )
        },
      };

      const cartItem: CreateCartDto = {
        product: { productId: 1, quantity: 1 },
      };

      // const user = {
      //   email: 'test@gmail.com',
      //   id: 1,
      // };

      const req = {
        session: { cart: undefined },
      };
      await controller.create(cartItem, undefined, req);
      expect(req.session.cart).toContain(cartItem);
    });
  });
});
