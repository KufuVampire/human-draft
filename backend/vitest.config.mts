import path from 'path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		root: './',
		include: ['src/**/*.{test,spec}.ts', 'test/**/*.{test,spec}.ts'],
	},
	resolve: {
		alias: {
			'@': path.resolve(process.cwd(), './'),
		},
	},
	plugins: [
		swc.vite({
			module: { type: 'es6' },
		}),
	],
});
