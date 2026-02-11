import { DOMSerializer, Node, Schema } from 'prosemirror-model';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';

import { codeBlock, image } from './milkdownCustomBlocks';

let nodes = addListNodes(basicSchema.spec.nodes, 'paragraph block*', 'block');
nodes = nodes.update('code_block', codeBlock).update('image', image);

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
