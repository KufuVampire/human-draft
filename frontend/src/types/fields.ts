import { FieldPath, RegisterOptions } from 'react-hook-form';

export interface IField<TFormValues extends Record<string, string>> {
	text: string;
	placeholder: string;
	type: string;
	bottomText?: string;
	registerName: FieldPath<TFormValues>;
	registerOptions: RegisterOptions<TFormValues>;
}
