import { SetMetadata } from '@nestjs/common';
import { PUBLIC_KEY } from '../auth.constant';

export const Public = () => SetMetadata(PUBLIC_KEY, true);
