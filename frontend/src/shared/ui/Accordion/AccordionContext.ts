import { createContext, useContext } from 'react';

export interface AccordionContextType {
	type: 'single' | 'multiple';
	expandedValues: string[];
	toggleItem: (value: string) => void;
}

export const AccordionContext = createContext<AccordionContextType | null>(null);

export const useAccordion = () => {
	const context = useContext(AccordionContext);
	if (!context) {
		throw new Error('useAccordion must be used within an Accordion');
	}
	return context;
};

export const AccordionItemContext = createContext<{ value: string } | null>(null);

export const useAccordionItem = () => {
	const context = useContext(AccordionItemContext);
	if (!context) {
		throw new Error('useAccordionItem must be used within an AccordionItem');
	}
	return context;
};
