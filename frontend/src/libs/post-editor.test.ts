import { describe, expect, it, vi } from 'vitest';

import { createPostCrepe } from './post-editor';

const viewOptionsKey = vi.hoisted(() => Symbol('editorViewOptionsCtx'));
const crepeMock = vi.hoisted(() => ({
	options: undefined as unknown,
	configure: undefined as unknown as (ctx: unknown) => void,
}));

vi.mock('@milkdown/core', () => ({ editorViewOptionsCtx: viewOptionsKey }));
vi.mock('@milkdown/crepe', () => ({
	Crepe: class {
		editor = {
			config: (fn: (ctx: unknown) => void) => {
				crepeMock.configure = fn;
			},
		};
		constructor(options: unknown) {
			crepeMock.options = options;
		}
	},
}));

const t = (key: string) => `tr:${key}`;

const create = () => {
	const onUpload = vi.fn();
	createPostCrepe({ root: document.createElement('div'), t, onUpload });
	return {
		onUpload,
		options: crepeMock.options as {
			featureConfigs: Record<string, Record<string, unknown>>;
		},
	};
};

describe('createPostCrepe (конструктор редактора поста)', () => {
	it('подписывает меню «/», загрузку изображений и блок кода через словарь', () => {
		const { featureConfigs } = create().options;

		expect(featureConfigs.placeholder.text).toBe('tr:createPostPage.defaultValue');
		expect(featureConfigs['block-edit']).toMatchObject({
			textGroup: { label: 'tr:editorMenu.groups.text', h2: { label: 'tr:editorMenu.h2' } },
			listGroup: { bulletList: { label: 'tr:editorMenu.bulletList' } },
			advancedGroup: { table: { label: 'tr:editorMenu.table' } },
		});
		expect(featureConfigs['image-block'].blockUploadButton).toBe('tr:editorMenu.imageUpload');
		expect(featureConfigs['code-mirror'].searchPlaceholder).toBe('tr:editorMenu.codeSearch');
	});

	it('передаёт загрузку изображений в блок изображения', () => {
		const { onUpload, options } = create();
		expect(options.featureConfigs['image-block'].onUpload).toBe(onUpload);
	});

	it('задаёт отступы прокрутки под шапку и нижний тулбар', () => {
		create();
		type Updater = (prev: Record<string, unknown>) => Record<string, unknown>;
		const update = vi.fn<(key: symbol, updater: Updater) => void>();

		crepeMock.configure({ update });

		expect(update).toHaveBeenCalledWith(viewOptionsKey, expect.any(Function));
		const nextOptions = update.mock.calls[0][1]({ editable: () => true });
		expect(nextOptions.scrollMargin).toMatchObject({ top: 80, bottom: 96 });
		expect(nextOptions.editable).toBeDefined();
	});
});
