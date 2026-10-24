import { DOMSerializer, Node, Schema } from 'prosemirror-model';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';

import { codeBlock, image } from './milkdownCustomBlocks';

let nodes = addListNodes(basicSchema.spec.nodes, 'paragraph block*', 'block');
nodes = nodes.update('code_block', codeBlock).update('image', image);

const schema = new Schema({
	nodes,
	marks: basicSchema.spec.marks,
});

export function milkdownJsonToHtml(json: unknown) {
	if (!json || typeof json !== 'object') return '';
	if (typeof document === 'undefined') return '';

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

	return div.innerHTML;
}
