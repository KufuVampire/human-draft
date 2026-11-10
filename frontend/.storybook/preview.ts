import type { Preview } from '@storybook/react';
import '../src/app/globals.css';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		backgrounds: {
			default: 'surface',
			values: [
				{ name: 'surface', value: 'var(--surface-base)' },
				{ name: 'card', value: 'var(--surface-card)' },
				{ name: 'dark', value: '#171717' },
				{ name: 'light', value: '#ffffff' },
			],
		},
	},
};

export default preview;
