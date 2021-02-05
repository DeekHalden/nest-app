import { Request, Response } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import * as mocks from 'node-mocks-http';

const req = mocks.createRequest();
const res = mocks.createResponse();

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
    req.csrfToken = jest.fn(() => ({ token: 'token' }));
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      const response = {
        token: 'token',
      };
      const result = JSON.parse(
        await appController.getHello(req, res)._getData(),
      );
      expect(result.token).toEqual(response);
    });
  });
});
