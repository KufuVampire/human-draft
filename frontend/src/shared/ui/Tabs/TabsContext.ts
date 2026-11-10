import { createContext, useContext } from 'react';

export interface TabsContextType {
	value?: string;
	onValueChange?: (value: string) => void;
}

export const TabsContext = createContext<TabsContextType | null>(null);

export const useTabs = () => {
	const context = useContext(TabsContext);
	if (!context) {
		throw new Error('useTabs must be used within a Tabs component');
	}
	return context;
};
