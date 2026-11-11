import { commandsCtx } from '@milkdown/core';
import { toggleLinkCommand } from '@milkdown/kit/component/link-tooltip';
import type { Ctx } from '@milkdown/kit/ctx';
import {
	Bold,
	Code,
	Heading2,
	Heading3,
	ImagePlus,
	Italic,
	Link,
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
import { type Command, NodeSelection } from 'prosemirror-state';

export interface ToolbarAction {
	labelKey: string;
	Icon: LucideIcon;
	/** Команда ProseMirror для схемы редактора; null — нужного mark/node в схеме нет. */
	getCommand?: (schema: Schema) => Command | null;
	/** Команда Milkdown, которой нужен контекст редактора (например, окно ввода ссылки Crepe). */
	run?: (ctx: Ctx) => void;
}

const mark = (name: string) => (schema: Schema) =>
	schema.marks[name] ? toggleMark(schema.marks[name]) : null;

const heading = (level: number) => (schema: Schema) =>
	schema.nodes.heading ? setBlockType(schema.nodes.heading, { level }) : null;

/**
 * Пустой блок изображения Crepe (в нём сразу кнопка загрузки файла).
 * Встаёт после текущего блока верхнего уровня — абзац, заголовок и код не режутся,
 * выделенное изображение не заменяется. Пустой абзац заменяется блоком изображения.
 */
const insertImageBlock = (schema: Schema): Command | null => {
	const imageBlock = schema.nodes['image-block'];
	if (!imageBlock) return null;
	return (state, dispatch) => {
		const { $to } = state.selection;
		const block = $to.depth > 0 ? $to.node(1) : null;
		const isEmptyTextBlock = Boolean(block?.isTextblock && block.content.size === 0);

		const tr = state.tr;
		let pos: number;
		if (block && isEmptyTextBlock) {
			pos = $to.before(1);
			tr.replaceWith(pos, $to.after(1), imageBlock.create());
		} else {
			pos = block ? $to.after(1) : state.selection.to;
			tr.insert(pos, imageBlock.create());
		}
		dispatch?.(tr.setSelection(NodeSelection.create(tr.doc, pos)).scrollIntoView());
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
		{
			labelKey: 'link',
			Icon: Link,
			// Та же команда, что у кнопки ссылки в тулбаре Crepe: открывает окно ввода адреса
			run: (ctx) => ctx.get(commandsCtx).call(toggleLinkCommand.key),
		},
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
