export const isNotFoundError = (error: unknown): boolean => {
	if (!error) return false;

	if (typeof error === 'object') {
		const err = error as {
			graphQLErrors?: Array<{
				message?: string;
				extensions?: {
					status?: number | string;
					code?: string | number;
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
			code?: string | number;
		};

		if (err.networkError) {
			return err.networkError.statusCode === 404;
		}

		if (Array.isArray(err.graphQLErrors) && err.graphQLErrors.length > 0) {
			return err.graphQLErrors.some((gqlErr) => {
				const status =
					gqlErr?.extensions?.originalError?.statusCode ||
					gqlErr?.extensions?.status;
				const code = gqlErr?.extensions?.code;

				return (
					status === 404 ||
					status === 'NOT_FOUND' ||
					code === 'NOT_FOUND' ||
					code === 404
				);
			});
		}

		const status = err.status || err.statusCode;
		if (status === 404) return true;

		if (err.code === 'NOT_FOUND' || err.code === 404) return true;
	}

	return false;
};
