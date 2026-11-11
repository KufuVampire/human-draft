import {
	Bold,
	Code,
	Heading2,
	Heading3,
	ImagePlus,
	Italic,
	List,
	ListOrdered,
	type LucideIcon,
	Quote,
	Redo2,
	Strikethrough,
	Undo2,
} from 'lucide-react';
import type { Schema } from 'prosemirror-model';
import { setBlockType, toggleMark, wrapIn } from 'prosemirror-commands';
import { redo, undo } from 'prosemirror-history';
import { wrapInList } from 'prosemirror-schema-list';
import { type Command, Selection } from 'prosemirror-state';

export interface ToolbarAction {
	labelKey: string;
	Icon: LucideIcon;
	/** Команда для схемы редактора; null — нужного mark/node в схеме нет. */
	getCommand: (schema: Schema) => Command | null;
}

const mark = (name: string) => (schema: Schema) =>
	schema.marks[name] ? toggleMark(schema.marks[name]) : null;

const heading = (level: number) => (schema: Schema) =>
	schema.nodes.heading ? setBlockType(schema.nodes.heading, { level }) : null;

/**
 * Пустой блок изображения Crepe (в нём сразу кнопка загрузки файла).
 * Вставляется после выделения, а не вместо него — выделенный текст не теряется.
 */
const insertImageBlock = (schema: Schema): Command | null => {
	const imageBlock = schema.nodes['image-block'];
	if (!imageBlock) return null;
	return (state, dispatch) => {
		const tr = state.tr.setSelection(Selection.near(state.doc.resolve(state.selection.to)));
		dispatch?.(tr.replaceSelectionWith(imageBlock.create()).scrollIntoView());
		return true;
	};
};

/** Кнопки по группам: история | заголовки | начертание | блоки | вставка. */
export const toolbarGroups: ToolbarAction[][] = [
	[
		{ labelKey: 'undo', Icon: Undo2, getCommand: () => undo },
		{ labelKey: 'redo', Icon: Redo2, getCommand: () => redo },
	],
	[
		{ labelKey: 'heading2', Icon: Heading2, getCommand: heading(2) },
		{ labelKey: 'heading3', Icon: Heading3, getCommand: heading(3) },
	],
	[
		{ labelKey: 'bold', Icon: Bold, getCommand: mark('strong') },
		{ labelKey: 'italic', Icon: Italic, getCommand: mark('emphasis') },
		{ labelKey: 'strike', Icon: Strikethrough, getCommand: mark('strike_through') },
		{ labelKey: 'code', Icon: Code, getCommand: mark('inlineCode') },
	],
	[
		{
			labelKey: 'quote',
			Icon: Quote,
			getCommand: (schema) =>
				schema.nodes.blockquote ? wrapIn(schema.nodes.blockquote) : null,
		},
		{
			labelKey: 'bulletList',
			Icon: List,
			getCommand: (schema) =>
				schema.nodes.bullet_list ? wrapInList(schema.nodes.bullet_list) : null,
		},
		{
			labelKey: 'orderedList',
			Icon: ListOrdered,
			getCommand: (schema) =>
				schema.nodes.ordered_list ? wrapInList(schema.nodes.ordered_list) : null,
		},
	],
	[{ labelKey: 'image', Icon: ImagePlus, getCommand: insertImageBlock }],
];

export const toolbarActions = toolbarGroups.flat();
