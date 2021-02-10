/* eslint-disable @typescript-eslint/no-var-requires */
const ONE_MINUTE = 60 * 1000;
import {
  AzureStorageOptions,
  AZURE_STORAGE_MODULE_OPTIONS,
} from '@nestjs/azure-storage';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { FileDto } from './dto/file.dto';

import { File } from './entities/file.entity';

import * as fs from 'fs/promises';

const {
  BlobServiceClient,
  ContainerClient,
  StorageSharedKeyCredential,
  getAccountNameFromUrl,
} = require('@azure/storage-blob');

const AZURE_STORAGE_CONNECTION_STRING =
  process.env['AZURE_STORAGE_CONNECTION_STRING'];

export const unlink = async (url: string): Promise<any> => await fs.unlink(url);

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File) private readonly fileRepository: Repository<File>,
    @Inject(AZURE_STORAGE_MODULE_OPTIONS)
    private readonly options: AzureStorageOptions,
  ) {}

  async create(createFileDto: CreateFileDto): Promise<FileDto> {
    const file = this.fileRepository.create(createFileDto);
    await this.fileRepository.save(file);
    return file;
  }

  async removeById(id: number): Promise<any> {
    const file = await this.fileRepository.findOne({ id });
    if (!file) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.fileRepository.delete(file.id);
    await unlink(file.url);
  }

  async remove({ url }: CreateFileDto): Promise<any> {
    const file = await this.fileRepository.findOne({ url });
    console.log(file);
    if (!file) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.fileRepository.delete(file.id);
    await unlink(file.url);
  }
  async removeFromAzure(id: number): Promise<any> {
    const file = await this.fileRepository.findOne({ id });

    if (!file) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    const blobServiceClient = await BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING,
    );
    const containerClient = await blobServiceClient.getContainerClient(
      process.env['AZURE_STORAGE_CONTAINER'],
    );
    const blockBlobClient = containerClient.getBlockBlobClient(`${file.name}`);
    const blobDeleteResponse = blockBlobClient.delete();
    await this.fileRepository.delete(id);
    return (await blobDeleteResponse).clientRequestId;
  }
}
