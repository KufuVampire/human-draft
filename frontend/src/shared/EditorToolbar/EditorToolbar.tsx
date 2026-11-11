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
	Quote,
	Strikethrough,
} from 'lucide-react';
import { setBlockType, toggleMark, wrapIn } from 'prosemirror-commands';
import { wrapInList } from 'prosemirror-schema-list';
import type { EditorView } from 'prosemirror-view';

import { cn } from '@/utils';

interface Props {
	getEditor: () => Editor | undefined;
	className?: string;
}

export const EditorToolbar = ({ getEditor, className }: Props) => {
	const runCommand = (command: (view: EditorView) => boolean) => {
		const editor = getEditor();
		if (!editor) return;

		editor.action((ctx) => {
			const view = ctx.get(editorViewCtx);
			command(view);
			view.focus();
		});
	};

	const handleBold = () =>
		runCommand((view) => {
			const mark = view.state.schema.marks.strong;
			return mark ? toggleMark(mark)(view.state, view.dispatch) : false;
		});

	const handleItalic = () =>
		runCommand((view) => {
			const mark = view.state.schema.marks.em;
			return mark ? toggleMark(mark)(view.state, view.dispatch) : false;
		});

	const handleStrike = () =>
		runCommand((view) => {
			const mark = view.state.schema.marks.strike_through;
			return mark ? toggleMark(mark)(view.state, view.dispatch) : false;
		});

	const handleCode = () =>
		runCommand((view) => {
			const mark = view.state.schema.marks.code_inline;
			return mark ? toggleMark(mark)(view.state, view.dispatch) : false;
		});

	const handleH2 = () =>
		runCommand((view) => {
			const node = view.state.schema.nodes.heading;
			return node
				? setBlockType(node, { level: 2 })(view.state, view.dispatch)
				: false;
		});

	const handleH3 = () =>
		runCommand((view) => {
			const node = view.state.schema.nodes.heading;
			return node
				? setBlockType(node, { level: 3 })(view.state, view.dispatch)
				: false;
		});

	const handleQuote = () =>
		runCommand((view) => {
			const node = view.state.schema.nodes.blockquote;
			return node ? wrapIn(node)(view.state, view.dispatch) : false;
		});

	const handleBulletList = () =>
		runCommand((view) => {
			const node = view.state.schema.nodes.bullet_list;
			return node ? wrapInList(node)(view.state, view.dispatch) : false;
		});

	const handleOrderedList = () =>
		runCommand((view) => {
			const node = view.state.schema.nodes.ordered_list;
			return node ? wrapInList(node)(view.state, view.dispatch) : false;
		});

	const actions = [
		{ label: 'H2', onClick: handleH2, icon: <Heading2 className='size-4' /> },
		{ label: 'H3', onClick: handleH3, icon: <Heading3 className='size-4' /> },
		{ label: 'Bold', onClick: handleBold, icon: <Bold className='size-4' /> },
		{ label: 'Italic', onClick: handleItalic, icon: <Italic className='size-4' /> },
		{ label: 'Strike', onClick: handleStrike, icon: <Strikethrough className='size-4' /> },
		{ label: 'Code', onClick: handleCode, icon: <Code className='size-4' /> },
		{ label: 'Quote', onClick: handleQuote, icon: <Quote className='size-4' /> },
		{ label: 'Bullet List', onClick: handleBulletList, icon: <List className='size-4' /> },
		{ label: 'Numbered List', onClick: handleOrderedList, icon: <ListOrdered className='size-4' /> },
	];

	return (
		<div
			role='toolbar'
			aria-label='Форматирование текста'
			className={cn(
				'sticky top-16 z-20 py-2 px-3 bg-surface-card/90 backdrop-blur-md border border-border-subtle rounded-xl shadow-sm flex items-center gap-1 overflow-x-auto scrollbar-none',
				className
			)}>
			{actions.map((act) => (
				<button
					key={act.label}
					type='button'
					onClick={act.onClick}
					aria-label={act.label}
					className='p-2 rounded-lg text-foreground hover:bg-surface-tag active:bg-surface-tag transition-colors shrink-0 flex items-center justify-center cursor-pointer'>
					{act.icon}
				</button>
			))}
		</div>
	);
};
