export interface ProseMirrorMark {
	type: string;
	attrs?: Record<string, unknown>;
}

export interface ProseMirrorNodeJSON {
	type: string;
	attrs?: Record<string, unknown>;
	content?: ProseMirrorNodeJSON[];
	marks?: ProseMirrorMark[];
	text?: string;
}

export interface ProseMirrorRendererProps {
	doc: unknown;
	className?: string;
}
