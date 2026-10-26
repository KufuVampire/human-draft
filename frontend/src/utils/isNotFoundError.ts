export const isNotFoundError = (error: unknown): boolean => {
	if (!error) return false;

	if (typeof error === 'object') {
		const err = error as {
			graphQLErrors?: Array<{
				message?: string;
				extensions?: {
					status?: number | string;
					code?: string;
					originalError?: {
						statusCode?: number;
						message?: string;
						error?: string;
					};
				};
			}>;
			networkError?: {
				statusCode?: number;
			};
			status?: number;
			statusCode?: number;
			message?: string;
		};

		if (err.networkError) {
			return false;
		}

		if (Array.isArray(err.graphQLErrors) && err.graphQLErrors.length > 0) {
			return err.graphQLErrors.some((gqlErr) => {
				const status =
					gqlErr?.extensions?.originalError?.statusCode ||
					gqlErr?.extensions?.status ||
					gqlErr?.extensions?.code;
				const message = String(gqlErr?.message || '').toLowerCase();

				return (
					status === 404 ||
					status === 'NOT_FOUND' ||
					message.includes('not found') ||
					message.includes('не найден')
				);
			});
		}

		const status = err.status || err.statusCode;
		if (status === 404) return true;

		const message = String(err.message || '').toLowerCase();
		return message.includes('not found') || message.includes('не найден');
	}

	return false;
};
