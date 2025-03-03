import { SetMetadata } from '@nestjs/common';
import { ALLOW_ANON_KEY } from '../auth.constant';

export const AllowAnon = () => SetMetadata(ALLOW_ANON_KEY, true);
