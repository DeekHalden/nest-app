import { IProcessor } from 'typeorm-fixtures-cli';
import { Product } from '../product/entities/product.entity';

export default class UserProcessor implements IProcessor<Product> {
  postProcess(name: string, object: { [key: string]: any }): void {
    object.name = `${object.firstName} ${object.lastName}`;
  }
}
