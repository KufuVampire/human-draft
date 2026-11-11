import { commandsCtx, editorViewCtx } from '@milkdown/core';
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
import { type Command, TextSelection } from 'prosemirror-state';

export interface ToolbarAction {
	labelKey: string;
	Icon: LucideIcon;
	/** Команда ProseMirror для схемы редактора; null — нужного mark/node в схеме нет. */
	getCommand?: (schema: Schema) => Command | null;
	/**
	 * Команда Milkdown, которой нужен контекст редактора (например, окно ввода ссылки Crepe).
	 * false — команда не применима; тогда показывается подсказка `hintKey`.
	 */
	run?: (ctx: Ctx) => boolean;
	hintKey?: string;
}

const mark = (name: string) => (schema: Schema) =>
	schema.marks[name] ? toggleMark(schema.marks[name]) : null;

const heading = (level: number) => (schema: Schema) =>
	schema.nodes.heading ? setBlockType(schema.nodes.heading, { level }) : null;

/**
 * Пустой блок изображения Crepe (в нём сразу кнопка загрузки файла).
 * Встаёт после текущего блока верхнего уровня — абзац, заголовок и код не режутся,
 * выделенное изображение не заменяется. Пустой абзац заменяется блоком изображения.
 * После блока — новый пустой абзац с курсором: иначе первый набранный символ заменил бы
 * выделенный пустой блок (клавиатура на телефоне остаётся открытой) или слился бы
 * со следующим абзацем.
 */
const insertImageBlock = (schema: Schema): Command | null => {
	const imageBlock = schema.nodes['image-block'];
	const paragraph = schema.nodes.paragraph;
	if (!imageBlock || !paragraph) return null;
	return (state, dispatch) => {
		const { $to } = state.selection;
		const block = $to.depth > 0 ? $to.node(1) : null;
		const isEmptyTextBlock = Boolean(block?.isTextblock && block.content.size === 0);

		const tr = state.tr;
		const node = imageBlock.create();
		let pos: number;
		if (block && isEmptyTextBlock) {
			pos = $to.before(1);
			tr.replaceWith(pos, $to.after(1), node);
		} else {
			pos = block ? $to.after(1) : state.selection.to;
			tr.insert(pos, node);
		}

		const after = pos + node.nodeSize;
		tr.insert(after, paragraph.create());
		dispatch?.(tr.setSelection(TextSelection.create(tr.doc, after + 1)).scrollIntoView());
		return true;
	};
};

/** Ссылка ставится на выделенный текст; без выделения Crepe создал бы пустую марку без ссылки. */
const toggleLink = (ctx: Ctx) => {
	if (ctx.get(editorViewCtx).state.selection.empty) return false;
	// Та же команда, что у кнопки ссылки в тулбаре Crepe: открывает окно ввода адреса
	return ctx.get(commandsCtx).call(toggleLinkCommand.key);
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
		{ labelKey: 'link', Icon: Link, run: toggleLink, hintKey: 'linkNeedsSelection' },
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
