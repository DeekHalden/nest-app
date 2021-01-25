import { SetMetadata } from '@nestjs/common';

export const VERIFIED = 'verified';
export const VerifiedDecorator = (arg: boolean) => SetMetadata(VERIFIED, arg);
