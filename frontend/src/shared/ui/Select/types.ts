export interface SelectOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface SelectProps {
	options: SelectOption[];
	value?: string;
	placeholder?: string;
	disabled?: boolean;
	error?: boolean | string;
	className?: string;
	onChange?: (value: string) => void;
}

export interface SelectListProps {
	id: string;
	options: SelectOption[];
	value?: string;
	highlightedIndex: number;
	onSelect: (val: string) => void;
	onHighlight: (idx: number) => void;
}
