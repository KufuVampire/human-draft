import { NodeSpec } from 'prosemirror-model';
import { schema as basicSchema } from 'prosemirror-schema-basic';

import { cn } from '../cn';

const preStyles =
	'overflow-auto rounded-sm bg-[var(--background-color-main)] whitespace-pre mb-2 transition-colors has-[code]:p-5';
const codeBlockStyles = 'text-wrap text-[var(--text-color-main)]';

export const codeBlock: NodeSpec = {
	...basicSchema.spec.nodes.get('code_block')!,
	attrs: {
		language: { default: null },
	},
	toDOM(node) {
		const { language } = node.attrs;
		return [
			'pre',
			{ class: preStyles },
			[
				'code',
				{ class: cn(codeBlockStyles, language && `language-${language}`) },
				0,
			],
		];
	},
};
