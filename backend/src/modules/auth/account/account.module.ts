import { Module } from '@nestjs/common';

import { SessionModule } from '../session/session.module';

import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';

@Module({
	providers: [AccountResolver, AccountService],
	imports: [SessionModule],
})
export class AccountModule {}
