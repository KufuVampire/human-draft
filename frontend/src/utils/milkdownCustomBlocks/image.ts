import { NodeSpec } from 'prosemirror-model';

const figureStyles = 'flex flex-col items-center w-full';

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
			fetchpriority: "high",
			width: "auto",
			height: "200",
		};

		if (caption) {
			return [
				'figure',
				figureAttrs,
				['img', { ...imgAttrs, class: 'mb-1', alt: caption }],
				['figcaption', {}, caption],
			];
		}

		return ['div', { class: 'flex justify-center w-full' }, ['img', imgAttrs]];
	},
};
