'use client';

import { editorViewCtx } from '@milkdown/core';
import type { Editor } from '@milkdown/core';
import { useTranslations } from 'next-intl';
import { Fragment, type MouseEvent } from 'react';

import { type ToolbarAction, toolbarGroups } from './toolbarActions';
import { useVisualViewportInset } from '@/hooks';
import { cn } from '@/utils';

interface Props {
	getEditor: () => Editor | undefined;
	className?: string;
}

// Не даём кнопке забрать фокус: иначе редактор теряет выделение, а на телефоне закрывается клавиатура
const keepEditorFocus = (e: MouseEvent) => e.preventDefault();

/**
 * Панель форматирования для телефонов. Ставится последней в форме: `sticky bottom`
 * держит её у нижнего края экрана, пока видна форма, и не даёт заехать на футер.
 * Над клавиатурой поднимается сдвигом на высоту перекрытой области.
 * На десктопе (`md+`) скрыта — там родной интерфейс Crepe.
 */
export const EditorToolbar = ({ getEditor, className }: Props) => {
	const t = useTranslations('editorToolbar');
	const keyboardInset = useVisualViewportInset();

	const runAction = ({ getCommand, run }: ToolbarAction) => {
		getEditor()?.action((ctx) => {
			// Команды Milkdown (ссылка) сами управляют фокусом: окну ввода адреса он нужен
			if (run) {
				run(ctx);
				return;
			}
			const view = ctx.get(editorViewCtx);
			getCommand?.(view.state.schema)?.(view.state, view.dispatch);
			view.focus();
		});
	};

	return (
		<div
			role='toolbar'
			aria-label={t('label')}
			style={keyboardInset ? { transform: `translateY(-${keyboardInset}px)` } : undefined}
			className={cn(
				// -mx-7: на всю ширину карточки (отступы Section p-4 + Container px-4), а не только поля формы
				'sticky bottom-2 z-header md:hidden -mx-7 bg-surface-card border border-border-subtle rounded-xl shadow-md px-2 py-1.5 flex items-center gap-1 overflow-x-auto scrollbar-none',
				className
			)}>
			{toolbarGroups.map((group, index) => (
				<Fragment key={group[0].labelKey}>
					{index > 0 && (
						<span
							aria-hidden
							className='w-px h-6 bg-border-subtle shrink-0 mx-0.5'
						/>
					)}
					{group.map((action) => (
						<button
							key={action.labelKey}
							type='button'
							onMouseDown={keepEditorFocus}
							onClick={() => runAction(action)}
							aria-label={t(action.labelKey)}
							title={t(action.labelKey)}
							className='size-11 rounded-lg text-foreground hover:bg-surface-tag active:bg-surface-tag transition-colors shrink-0 flex items-center justify-center cursor-pointer'>
							<action.Icon className='size-5' />
						</button>
					))}
				</Fragment>
			))}
		</div>
	);
};
