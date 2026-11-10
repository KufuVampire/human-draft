import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
	stories: ['../src/shared/ui/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
	async viteFinal(config) {
		return {
			...config,
			define: {
				...config.define,
				'process.env': {},
			},
			optimizeDeps: {
				...config.optimizeDeps,
				exclude: [...(config.optimizeDeps?.exclude || []), 'next/link'],
			},
			resolve: {
				...config.resolve,
				alias: {
					...config.resolve?.alias,
					'@': path.resolve(__dirname, '../src'),
					'next/link': path.resolve(__dirname, 'mockNextLink.tsx'),
				},
			},
		};
	},
};

export default config;
