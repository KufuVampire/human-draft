import type { Editor } from '@milkdown/core';
import { fireEvent, render, screen } from '@testing-library/react';
import { Schema } from 'prosemirror-model';
import { EditorState, TextSelection, Transaction } from 'prosemirror-state';
import { describe, expect, it, vi } from 'vitest';

import { EditorToolbar, toolbarActions } from './EditorToolbar';

vi.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key,
}));

// Схема с теми же именами mark/node, что у Milkdown (preset-commonmark + gfm)
const schema = new Schema({
	nodes: {
		doc: { content: 'block+' },
		paragraph: { group: 'block', content: 'inline*' },
		heading: { group: 'block', content: 'inline*', attrs: { level: { default: 1 } } },
		blockquote: { group: 'block', content: 'block+' },
		bullet_list: { group: 'block', content: 'list_item+' },
		ordered_list: { group: 'block', content: 'list_item+' },
		list_item: { content: 'paragraph block*' },
		text: { group: 'inline' },
	},
	marks: { strong: {}, emphasis: {}, inlineCode: {}, strike_through: {} },
});

const setup = () => {
	const doc = schema.node('doc', null, [
		schema.node('paragraph', null, [schema.text('привет')]),
	]);
	const view = {
		state: EditorState.create({
			doc,
			selection: TextSelection.create(doc, 1, 7),
		}),
		dispatch: (tr: Transaction) => {
			view.state = view.state.apply(tr);
		},
		focus: vi.fn(),
	};
	const editor = {
		action: (cb: (ctx: { get: () => typeof view }) => void) => cb({ get: () => view }),
	} as unknown as Editor;

	render(<EditorToolbar getEditor={() => editor} />);
	return view;
};

describe('EditorToolbar (панель форматирования редактора)', () => {
	it('для каждой кнопки находит mark или node в схеме с именами Milkdown', () => {
		for (const action of toolbarActions) {
			expect(action.getCommand(schema), action.labelKey).not.toBeNull();
		}
	});

	it.each([
		['bold', 'strong'],
		['italic', 'emphasis'],
		['strike', 'strike_through'],
		['code', 'inlineCode'],
	])('кнопка «%s» применяет mark %s к выделенному тексту', (label, markName) => {
		const view = setup();

		fireEvent.click(screen.getByRole('button', { name: label }));

		const textNode = view.state.doc.firstChild?.firstChild;
		expect(textNode?.marks.map((m) => m.type.name)).toEqual([markName]);
		expect(view.focus).toHaveBeenCalled();
	});

	it('кнопка заголовка превращает абзац в заголовок нужного уровня', () => {
		const view = setup();

		fireEvent.click(screen.getByRole('button', { name: 'heading2' }));

		expect(view.state.doc.firstChild?.type.name).toBe('heading');
		expect(view.state.doc.firstChild?.attrs.level).toBe(2);
	});

	it('кнопка списка оборачивает абзац в маркированный список', () => {
		const view = setup();

		fireEvent.click(screen.getByRole('button', { name: 'bulletList' }));

		expect(view.state.doc.firstChild?.type.name).toBe('bullet_list');
	});

	it('не падает, пока редактор ещё не создан', () => {
		render(<EditorToolbar getEditor={() => undefined} />);

		expect(() =>
			fireEvent.click(screen.getByRole('button', { name: 'bold' }))
		).not.toThrow();
	});

	it('подписывает панель и кнопки через словарь', () => {
		render(<EditorToolbar getEditor={() => undefined} />);

		expect(screen.getByRole('toolbar', { name: 'label' })).toBeInTheDocument();
		expect(screen.getAllByRole('button')).toHaveLength(toolbarActions.length);
	});
});
