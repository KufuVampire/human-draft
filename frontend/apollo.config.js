import 'dotenv/config';

export default apolloConfig = {
	service: {
		endpoint: {
			url: process.env.NEXT_PUBLIC_SERVER_URL,
			skipSSLValidation: true,
		},
	},
};
