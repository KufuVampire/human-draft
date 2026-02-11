import { NodeSpec } from 'prosemirror-model';

const figureStyles = 'flex flex-col items-center w-full mb-3';
const imgStyles = 'mb-1';

export const image: NodeSpec = {
	inline: false,
	group: 'block',
	draggable: false,
	attrs: {
		src: {},
		ratio: { default: null },
		caption: { default: null },
	},
	parseDOM: [
		{
			tag: 'figure',
			getAttrs(dom) {
				const img = dom.querySelector('img');
				const caption = dom.querySelector('figcaption');
				return {
					src: img?.getAttribute('src'),
					caption: caption?.textContent ?? null,
				};
			},
		},
	],
	toDOM(node) {
		const { src, caption } = node.attrs;

		const figureAttrs = { class: figureStyles };
		const imgAttrs = {
			src,
			class: imgStyles,
		};

		if (caption) {
			return [
				'figure',
				figureAttrs,
				['img', imgAttrs],
				['figcaption', {}, caption],
			];
		}

		return ['img', imgAttrs];
	},
};
