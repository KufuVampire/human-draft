import { editorViewOptionsCtx } from '@milkdown/core';
import { Crepe } from '@milkdown/crepe';

/** Отступы прокрутки к курсору: сверху — под шапку, снизу — под мобильный тулбар. */
const SCROLL_MARGIN = { top: 80, bottom: 96, left: 5, right: 5 };

interface Params {
	root: HTMLElement;
	t: (key: string) => string;
	onUpload: (file: File) => Promise<string>;
}

/** Редактор поста (создание и правка): все фичи Crepe, подписи из словарей. */
export const createPostCrepe = ({ root, t, onUpload }: Params) => {
	const menu = (key: string) => ({ label: t(`editorMenu.${key}`) });

	const crepe = new Crepe({
		root,
		features: {
			placeholder: true,
			'image-block': true,
		},
		featureConfigs: {
			placeholder: {
				text: t('createPostPage.defaultValue'),
			},
			'block-edit': {
				textGroup: {
					label: t('editorMenu.groups.text'),
					text: menu('text'),
					h1: menu('h1'),
					h2: menu('h2'),
					h3: menu('h3'),
					h4: menu('h4'),
					h5: menu('h5'),
					h6: menu('h6'),
					quote: menu('quote'),
					divider: menu('divider'),
				},
				listGroup: {
					label: t('editorMenu.groups.list'),
					bulletList: menu('bulletList'),
					orderedList: menu('orderedList'),
					taskList: menu('taskList'),
				},
				advancedGroup: {
					label: t('editorMenu.groups.advanced'),
					image: menu('image'),
					codeBlock: menu('codeBlock'),
					table: menu('table'),
					math: menu('math'),
				},
			},
			'code-mirror': {
				copyText: t('createPostPage.copyCode'),
				searchPlaceholder: t('editorMenu.codeSearch'),
				noResultText: t('editorMenu.codeNoResult'),
				previewToggleText: (previewOnlyMode) =>
					t(previewOnlyMode ? 'editorMenu.codeEdit' : 'editorMenu.codeHide'),
			},
			'link-tooltip': {
				inputPlaceholder: t('editorMenu.linkPlaceholder'),
			},
			'image-block': {
				onUpload,
				blockUploadButton: t('editorMenu.imageUpload'),
				blockConfirmButton: t('editorMenu.imageConfirm'),
				blockUploadPlaceholderText: t('editorMenu.imagePasteLink'),
				blockCaptionPlaceholderText: t('editorMenu.imageCaption'),
				inlineUploadButton: t('editorMenu.imageUpload'),
				inlineUploadPlaceholderText: t('editorMenu.imagePasteLink'),
			},
		},
	});

	crepe.editor.config((ctx) => {
		ctx.update(editorViewOptionsCtx, (prev) => ({
			...prev,
			scrollMargin: SCROLL_MARGIN,
		}));
	});

	return crepe;
};
