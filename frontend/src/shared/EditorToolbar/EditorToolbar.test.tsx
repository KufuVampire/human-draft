import { commandsCtx, type Editor } from '@milkdown/core';
import { toggleLinkCommand } from '@milkdown/kit/component/link-tooltip';
import { createEvent, fireEvent, render, screen } from '@testing-library/react';
import { type Node, Schema } from 'prosemirror-model';
import { history } from 'prosemirror-history';
import {
	EditorState,
	NodeSelection,
	type Selection,
	TextSelection,
	Transaction,
} from 'prosemirror-state';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { EditorToolbar } from './EditorToolbar';
import { toolbarActions } from './toolbarActions';

vi.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key,
}));

const toastInfo = vi.hoisted(() => vi.fn());
vi.mock('sonner', () => ({ toast: { info: toastInfo } }));

// Схема с теми же именами mark/node, что у Milkdown (preset-commonmark + gfm + image-block Crepe)
const schema = new Schema({
	nodes: {
		doc: { content: 'block+' },
		paragraph: { group: 'block', content: 'inline*' },
		heading: { group: 'block', content: 'inline*', attrs: { level: { default: 1 } } },
		blockquote: { group: 'block', content: 'block+' },
		bullet_list: { group: 'block', content: 'list_item+' },
		ordered_list: { group: 'block', content: 'list_item+' },
		list_item: { content: 'paragraph block*' },
		'image-block': { group: 'block', atom: true, attrs: { src: { default: '' } } },
		text: { group: 'inline' },
	},
	marks: { strong: {}, emphasis: {}, inlineCode: {}, strike_through: {} },
});

const paragraph = (text: string) => schema.node('paragraph', null, text ? [schema.text(text)] : []);

const setup = (
	doc: Node = schema.node('doc', null, [paragraph('привет')]),
	select: (doc: Node) => Selection = (d) => TextSelection.create(d, 1, 7)
) => {
	const view = {
		state: EditorState.create({ doc, selection: select(doc), plugins: [history()] }),
		dispatch: (tr: Transaction) => {
			view.state = view.state.apply(tr);
		},
		focus: vi.fn(),
	};
	const commands = { call: vi.fn() };
	const editor = {
		action: (cb: (ctx: { get: (key: unknown) => unknown }) => void) =>
			cb({ get: (key) => (key === commandsCtx ? commands : view) }),
	} as unknown as Editor;

	render(<EditorToolbar getEditor={() => editor} />);
	return { view, commands };
};

const marksOfFirstText = (view: ReturnType<typeof setup>['view']) =>
	view.state.doc.firstChild?.firstChild?.marks.map((m) => m.type.name);

const blocks = (view: ReturnType<typeof setup>['view']) => {
	const result: string[] = [];
	view.state.doc.forEach((node) =>
		result.push(node.isTextblock ? `${node.type.name}:${node.textContent}` : node.type.name)
	);
	return result;
};

const clickImage = () => fireEvent.click(screen.getByRole('button', { name: 'image' }));

describe('EditorToolbar (панель форматирования редактора)', () => {
	it('для каждой кнопки находит mark или node в схеме с именами Milkdown', () => {
		for (const action of toolbarActions.filter((a) => a.getCommand)) {
			expect(action.getCommand?.(schema), action.labelKey).not.toBeNull();
		}
	});

	it.each([
		['bold', 'strong'],
		['italic', 'emphasis'],
		['strike', 'strike_through'],
		['code', 'inlineCode'],
	])('кнопка «%s» применяет mark %s к выделенному тексту', (label, markName) => {
		const { view } = setup();

		fireEvent.click(screen.getByRole('button', { name: label }));

		expect(marksOfFirstText(view)).toEqual([markName]);
		expect(view.focus).toHaveBeenCalled();
	});

	it('«Ссылка» на выделенный текст вызывает команду ссылки Milkdown (окно ввода адреса Crepe)', () => {
		const { commands } = setup();

		fireEvent.click(screen.getByRole('button', { name: 'link' }));

		expect(commands.call).toHaveBeenCalledWith(toggleLinkCommand.key);
	});

	it('«Ссылка» без выделения не вызывает команду и просит выделить текст', () => {
		const { commands } = setup(undefined, (d) => TextSelection.create(d, 3));

		fireEvent.click(screen.getByRole('button', { name: 'link' }));

		expect(commands.call).not.toHaveBeenCalled();
		expect(toastInfo).toHaveBeenCalledWith('linkNeedsSelection');
	});

	it('кнопка заголовка превращает абзац в заголовок нужного уровня', () => {
		const { view } = setup();

		fireEvent.click(screen.getByRole('button', { name: 'heading2' }));

		expect(view.state.doc.firstChild?.type.name).toBe('heading');
		expect(view.state.doc.firstChild?.attrs.level).toBe(2);
	});

	it('кнопка списка оборачивает абзац в маркированный список', () => {
		const { view } = setup();

		fireEvent.click(screen.getByRole('button', { name: 'bulletList' }));

		expect(view.state.doc.firstChild?.type.name).toBe('bullet_list');
	});

	it('«Отменить» и «Повторить» откатывают и возвращают последнее изменение', () => {
		const { view } = setup();

		fireEvent.click(screen.getByRole('button', { name: 'bold' }));
		fireEvent.click(screen.getByRole('button', { name: 'undo' }));
		expect(marksOfFirstText(view)).toEqual([]);

		fireEvent.click(screen.getByRole('button', { name: 'redo' }));
		expect(marksOfFirstText(view)).toEqual(['strong']);
	});

	describe('«Картинка»', () => {
		it('при курсоре посреди абзаца вставляет блок после абзаца, не разрезая его', () => {
			const doc = schema.node('doc', null, [paragraph('Hello world')]);
			const { view } = setup(doc, (d) => TextSelection.create(d, 2));

			clickImage();

			expect(blocks(view)).toEqual(['paragraph:Hello world', 'image-block', 'paragraph:']);
		});

		it('не разрезает заголовок', () => {
			const doc = schema.node('doc', null, [
				schema.node('heading', { level: 2 }, [schema.text('Заголовок')]),
			]);
			const { view } = setup(doc, (d) => TextSelection.create(d, 4));

			clickImage();

			expect(blocks(view)).toEqual(['heading:Заголовок', 'image-block', 'paragraph:']);
		});

		it('при выделенном изображении добавляет новое после него, старое остаётся', () => {
			const doc = schema.node('doc', null, [
				schema.node('image-block', { src: 'a.png' }),
				paragraph('после'),
			]);
			const { view } = setup(doc, (d) => NodeSelection.create(d, 0));

			clickImage();

			expect(blocks(view)).toEqual(['image-block', 'image-block', 'paragraph:', 'paragraph:после']);
			expect(view.state.doc.firstChild?.attrs.src).toBe('a.png');
		});

		it('заменяет пустой абзац блоком изображения', () => {
			const doc = schema.node('doc', null, [paragraph('текст'), paragraph('')]);
			const { view } = setup(doc, (d) => TextSelection.create(d, 8));

			clickImage();

			expect(blocks(view)).toEqual(['paragraph:текст', 'image-block', 'paragraph:']);
		});

		it('не стирает выделенный текст', () => {
			const { view } = setup();

			clickImage();

			expect(blocks(view)).toEqual(['paragraph:привет', 'image-block', 'paragraph:']);
		});

		it('ставит курсор в абзац после блока: набор текста не заменяет изображение', () => {
			const doc = schema.node('doc', null, [paragraph('текст'), paragraph('дальше')]);
			const { view } = setup(doc, (d) => TextSelection.create(d, 3));

			clickImage();
			view.dispatch(view.state.tr.insertText('abc'));

			expect(view.state.selection).toBeInstanceOf(TextSelection);
			expect(blocks(view)).toEqual(['paragraph:текст', 'image-block', 'paragraph:abc', 'paragraph:дальше']);
		});

		it('переиспользует пустой абзац после блока, а не добавляет ещё один', () => {
			const doc = schema.node('doc', null, [
				paragraph('текст'),
				paragraph(''),
				paragraph('после'),
			]);
			const { view } = setup(doc, (d) => TextSelection.create(d, 3));

			clickImage();
			view.dispatch(view.state.tr.insertText('abc'));

			expect(blocks(view)).toEqual(['paragraph:текст', 'image-block', 'paragraph:abc', 'paragraph:после']);
		});

		it('при выделенном изображении и пустом абзаце за ним не оставляет лишней пустой строки', () => {
			const doc = schema.node('doc', null, [
				schema.node('image-block', { src: 'a.png' }),
				paragraph(''),
				paragraph('после'),
			]);
			const { view } = setup(doc, (d) => NodeSelection.create(d, 0));

			clickImage();

			expect(blocks(view)).toEqual(['image-block', 'image-block', 'paragraph:', 'paragraph:после']);
		});
	});

	describe('над клавиатурой', () => {
		const originalViewport = window.visualViewport;
		const originalInnerHeight = window.innerHeight;

		afterEach(() => {
			Object.defineProperty(window, 'visualViewport', { value: originalViewport, configurable: true });
			Object.defineProperty(window, 'innerHeight', { value: originalInnerHeight, configurable: true });
		});

		it('поднимает порог прилипания на высоту клавиатуры, а не сдвигает тулбар', () => {
			const viewport = Object.assign(new EventTarget(), { height: 300, offsetTop: 0 });
			Object.defineProperty(window, 'visualViewport', { value: viewport, configurable: true });
			Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true });

			render(<EditorToolbar getEditor={() => undefined} />);
			const toolbar = screen.getByRole('toolbar');

			expect(toolbar.style.bottom).toBe('308px');
			expect(toolbar.style.transform).toBe('');
		});

		it('без клавиатуры порог берётся из класса bottom-2', () => {
			render(<EditorToolbar getEditor={() => undefined} />);
			expect(screen.getByRole('toolbar').style.bottom).toBe('');
		});
	});

	it('нажатие на кнопку не забирает фокус у редактора', () => {
		render(<EditorToolbar getEditor={() => undefined} />);
		const button = screen.getByRole('button', { name: 'bold' });
		const mouseDown = createEvent.mouseDown(button);

		fireEvent(button, mouseDown);

		expect(mouseDown.defaultPrevented).toBe(true);
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
