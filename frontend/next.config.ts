import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'human-draft-s3-bucket.s3.amazonaws.com',
				port: '',
				pathname: '/**',
			},
		],
	},
};

const withNextIntl = createNextIntlPlugin('./src/libs/i18n/request.ts');
export default withNextIntl(nextConfig);
