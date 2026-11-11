'use client';

import { editorViewCtx } from '@milkdown/core';
import type { Editor } from '@milkdown/core';
import {
	Bold,
	Code,
	Heading2,
	Heading3,
	Italic,
	List,
	ListOrdered,
	LucideIcon,
	Quote,
	Strikethrough,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Schema } from 'prosemirror-model';
import { setBlockType, toggleMark, wrapIn } from 'prosemirror-commands';
import { wrapInList } from 'prosemirror-schema-list';
import type { Command } from 'prosemirror-state';

import { cn } from '@/utils';

interface ToolbarAction {
	labelKey: string;
	Icon: LucideIcon;
	/** Команда для схемы редактора; null — нужного mark/node в схеме нет. */
	getCommand: (schema: Schema) => Command | null;
}

const mark = (name: string) => (schema: Schema) =>
	schema.marks[name] ? toggleMark(schema.marks[name]) : null;

const heading = (level: number) => (schema: Schema) =>
	schema.nodes.heading ? setBlockType(schema.nodes.heading, { level }) : null;

export const toolbarActions: ToolbarAction[] = [
	{ labelKey: 'heading2', Icon: Heading2, getCommand: heading(2) },
	{ labelKey: 'heading3', Icon: Heading3, getCommand: heading(3) },
	{ labelKey: 'bold', Icon: Bold, getCommand: mark('strong') },
	{ labelKey: 'italic', Icon: Italic, getCommand: mark('emphasis') },
	{ labelKey: 'strike', Icon: Strikethrough, getCommand: mark('strike_through') },
	{ labelKey: 'code', Icon: Code, getCommand: mark('inlineCode') },
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
];

interface Props {
	getEditor: () => Editor | undefined;
	className?: string;
}

export const EditorToolbar = ({ getEditor, className }: Props) => {
	const t = useTranslations('editorToolbar');

	const runAction = ({ getCommand }: ToolbarAction) => {
		getEditor()?.action((ctx) => {
			const view = ctx.get(editorViewCtx);
			getCommand(view.state.schema)?.(view.state, view.dispatch);
			view.focus();
		});
	};

	return (
		<div
			role='toolbar'
			aria-label={t('label')}
			className={cn(
				'sticky top-16 z-20 py-2 px-3 bg-surface-card/90 backdrop-blur-md border border-border-subtle rounded-xl shadow-sm flex items-center gap-1 overflow-x-auto scrollbar-none',
				className
			)}>
			{toolbarActions.map((action) => (
				<button
					key={action.labelKey}
					type='button'
					onClick={() => runAction(action)}
					aria-label={t(action.labelKey)}
					title={t(action.labelKey)}
					className='p-2 rounded-lg text-foreground hover:bg-surface-tag active:bg-surface-tag transition-colors shrink-0 flex items-center justify-center cursor-pointer'>
					<action.Icon className='size-4' />
				</button>
			))}
		</div>
	);
};
