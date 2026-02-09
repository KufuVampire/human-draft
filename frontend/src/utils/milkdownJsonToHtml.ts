import { DOMSerializer, Node, NodeSpec, Schema } from 'prosemirror-model';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';

const codeBlock: NodeSpec = {
	...basicSchema.spec.nodes.get('code_block')!,
	attrs: {
		language: { default: null },
	},
	toDOM(node) {
		const { language } = node.attrs;
		return [
			'pre',
			['code', language ? { class: `language-${language}` } : {}, 0],
		];
	},
};

let nodes = addListNodes(basicSchema.spec.nodes, 'paragraph block*', 'block');
nodes = nodes.update('code_block', codeBlock);

export const schema = new Schema({
	nodes,
	marks: basicSchema.spec.marks,
});

export function milkdownJsonToHtml(json: unknown, title?: string) {
	if (!json || typeof json !== 'object') return '';

	let doc: Node;
	try {
		doc = Node.fromJSON(schema, json);
	} catch {
		return '';
	}

	const serializer = DOMSerializer.fromSchema(schema);
	const fragment = serializer.serializeFragment(doc.content);
	const div = document.createElement('div');
	div.appendChild(fragment);

	if (title) {
		return `<h1>${title}</h1>${div.innerHTML}`;
	}

	return div.innerHTML;
}
