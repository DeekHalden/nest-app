import {
  Controller,
  Inject,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import {
  AzureStorageFileInterceptor,
  UploadedFileMetadata,
} from '@nestjs/azure-storage';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post('upload')
  @UseInterceptors(AzureStorageFileInterceptor('file'))
  async uploadedFilesUsingInterceptor(
    @UploadedFile() file: UploadedFileMetadata,
  ): Promise<any> {
    this.logger.log({ message: file.storageUrl, level: 'info' });
    return await this.fileService.create({
      url: file.storageUrl,
      name: file.originalname,
    });
  }
}
