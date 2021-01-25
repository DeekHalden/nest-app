import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';

import { MockRepository } from '../shared/mock-repository';
import { Connection } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { HttpException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';

const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
  save: jest.fn(),
});

describe('ProductService', () => {
  let service: ProductService;
  let unitRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: Connection,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Product),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);

    unitRepository = module.get<MockRepository>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(unitRepository).toBeDefined();
  });

  describe('create', () => {
    const createUnitDto: CreateProductDto = {
      title: 'test',
      price: '12134.44',
      image: 'http://placeimg.com/640/400',
    };
    describe('if product not exists', () => {
      it('should create product and return it', async () => {
        const expectedUnit = {};
        unitRepository.create.mockReturnValue(expectedUnit);
        const product = await service.create(createUnitDto);
        expect(product).toEqual(expectedUnit);
      });
    });
    describe('otherwise', () => {
      it('should throw "HttpException"', async () => {
        try {
          unitRepository.findOne.mockReturnValue('test');
          expect(await service.create(createUnitDto)).rejects.toThrow();
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.message).toEqual(
            'Product with such name already exists',
          );
        }
      });
    });
  });

  describe('findAll', () => {
    it('should return list of all units', async () => {
      const expectedUnits: Product[] = [
        {
          title: 'Cortney_Lindgren28',
          image: 'http://placeimg.com/640/480',
          price: '14512.77',
          id: 1,
          createdAt: '2021-01-18 12:33:34.167528',
          updatedAt: '2021-01-18 12:33:34.167528',
        },
      ];
      unitRepository.find.mockReturnValue(expectedUnits);
      const units = await service.findAll();
      expect(units).toEqual(expectedUnits);
    });
  });

  describe('findOne', () => {
    describe('if product with ID exists', () => {
      it('should return product', async () => {
        const id = 1;
        const expectedUnit = {};
        unitRepository.findOne.mockReturnValue(expectedUnit);
        const product = await service.findOne({ id });
        expect(product).toEqual(expectedUnit);
      });
    });
    describe('otherwise', () => {
      it('should throw "NotFoundException', async () => {
        try {
          const id = 1;
          unitRepository.findOne.mockReturnValue(undefined);
          expect(await service.findOne({ id })).rejects.toThrow();
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.message).toEqual('Product not found');
        }
      });
    });
  });

  describe('delete', () => {
    it('should remove product and return undefined', async () => {
      const expectedUnit = undefined;
      const id = 1;
      unitRepository.delete.mockReturnValue(expectedUnit);
      const result = await service.delete(id);
      expect(result).toEqual(expectedUnit);
    });
  });

  describe('patch', () => {
    describe('if product with ID found', () => {
      it('should update product', async () => {
        const { id, ...restData } = {
          id: 1,
          title: 'Pasta',
        };
        const expectedItem = {};
        unitRepository.update.mockReturnValue(expectedItem);
        const updatedItem = await service.patch(id, restData);
        expect(updatedItem).toEqual(expectedItem);
      });
    });
    describe('otherwise', () => {
      it('should throw "NotFoundException"', async () => {
        const { id, ...restData } = {
          id: 123123,
          title: 'Pasta',
        };
        const expectedItem = undefined;
        unitRepository.update.mockReturnValue(expectedItem);
        try {
          expect(await service.patch(id, restData)).rejects.toThrow();
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.message).toEqual('Product not found');
        }
      });
    });
  });
});
