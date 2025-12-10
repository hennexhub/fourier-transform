import { createContext, SetStateAction, useContext, useState } from 'react';

interface ActiveRendererContextType {
	id: string;
	setId: React.Dispatch<SetStateAction<string>>;
}

const ActiveRendererContext = createContext<
	ActiveRendererContextType | undefined
>(undefined);

export function ActiveRendererIdProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [id, setId] = useState<string>('');

	return (
		<ActiveRendererContext.Provider value={{ id, setId }}>
			{children}
		</ActiveRendererContext.Provider>
	);
}

export function useActiveRendererId() {
	const context = useContext(ActiveRendererContext);
	if (!context) {
		throw new Error('useSettings must be used within a SettingsProvider');
	}
	return context;
}
