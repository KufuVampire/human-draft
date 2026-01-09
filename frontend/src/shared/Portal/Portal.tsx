import { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

export const Portal = ({ children }: PropsWithChildren) => {
	if (typeof document === 'undefined') return null;
	return createPortal(children, document.body);
};
