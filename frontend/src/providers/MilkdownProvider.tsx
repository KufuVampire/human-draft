'use client';

import { MilkdownProvider } from '@milkdown/react';
import { PropsWithChildren } from 'react';

export const EditorProvider = ({ children }: PropsWithChildren) => {
	return <MilkdownProvider>{children}</MilkdownProvider>;
};
