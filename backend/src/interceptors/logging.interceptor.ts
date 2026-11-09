import {
	CallHandler,
	ExecutionContext,
	Injectable,
	Logger,
	NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private readonly logger = new Logger('GraphQL');

	public intercept(
		context: ExecutionContext,
		next: CallHandler
	): Observable<any> {
		const gqlCtx = GqlExecutionContext.create(context);
		const info = gqlCtx.getInfo();

		if (!info) {
			return next.handle();
		}

		const parentType = info.parentType?.name;
		const fieldName = info.fieldName;

		if (parentType !== 'Mutation' && parentType !== 'Query') {
			return next.handle();
		}

		const isMutation = parentType === 'Mutation';
		const start = Date.now();

		return next.handle().pipe(
			tap({
				next: () => {
					const duration = Date.now() - start;
					if (isMutation) {
						this.logger.log(`[Mutation] ${fieldName} executed in ${duration}ms`);
					}
				},
				error: (err: unknown) => {
					const duration = Date.now() - start;
					const errMessage = err instanceof Error ? err.message : String(err);
					if (isMutation) {
						this.logger.error(
							`[Mutation] ${fieldName} failed in ${duration}ms: ${errMessage}`
						);
					}
				},
			})
		);
	}
}
