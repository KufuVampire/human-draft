import { applyDecorators, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@/src/guards';

export function Auth() {
	return applyDecorators(UseGuards(AuthGuard));
}
