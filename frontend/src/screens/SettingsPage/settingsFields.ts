import type { TypeUpdateProfileSchema } from '@/schemas';
import type { IField } from '@/types';

export const settingsFieldItems: IField<TypeUpdateProfileSchema>[] = [
	{
		text: 'fields.username',
		placeholder: 'fields.username',
		type: 'text',
		registerName: 'username',
		registerOptions: {
			minLength: 3,
			maxLength: 16,
			required: true,
		},
	},
	{
		text: 'fields.email',
		placeholder: 'fields.email',
		type: 'email',
		registerName: 'email',
		registerOptions: {
			required: true,
		},
	},
	{
		text: 'fields.shortDescription',
		placeholder: 'fields.shortDescription',
		type: 'text',
		registerName: 'description',
		registerOptions: {},
	},
];
