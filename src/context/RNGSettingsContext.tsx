import {
	createContext,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from 'react';
import { RNGCirclesSettings } from '@/model/model.ts';
import { useActiveRendererId } from '@/context/ActiveRendererContext.tsx';

export interface RNGCircleRendererSettings {
	id: string;
	rngSettings: RNGCirclesSettings;
}

interface SettingsContextType {
	rngSettingsList: RNGCircleRendererSettings[];
	addRNGSettings: (newSettings: RNGCircleRendererSettings) => void;
	updateRNGSettings: (updatedSettings: Partial<RNGCirclesSettings>) => void;
	removeRNGSettings: () => void;
	setRNGSettingsList: React.Dispatch<
		SetStateAction<RNGCircleRendererSettings[]>
	>;
	currentRNGSettings: RNGCirclesSettings | undefined;
	setCurrentRNGSettings: React.Dispatch<
		SetStateAction<RNGCirclesSettings | undefined>
	>;
	updateCurrentRNGSettings: (
		updatedSettings: Partial<RNGCirclesSettings>,
	) => void;
}

const RandomCircleContext = createContext<SettingsContextType | undefined>(
	undefined,
);

export function RNGSettingsContext({
	children,
}: {
	children: React.ReactNode;
}) {
	const [rngSettingsList, setRNGSettingsList] = useState<
		RNGCircleRendererSettings[]
	>([]);
	const { id } = useActiveRendererId();
	const [currentRNGSettings, setCurrentRNGSettings] =
		useState<RNGCirclesSettings>();

	const updateCurrentRNGSettings = (
		updatedSettings: Partial<RNGCirclesSettings>,
	) => {
		setCurrentRNGSettings((prevSettings) =>
			prevSettings ? { ...prevSettings, ...updatedSettings } : prevSettings,
		);
	};

	useEffect(() => {
		if (rngSettingsList && rngSettingsList.length > 0) {
			const rngSettings = rngSettingsList.filter((s) => s.id === id)[0]
				.rngSettings;
			if (rngSettings) {
				setCurrentRNGSettings(rngSettings);
			}
		}
	}, [id, rngSettingsList]);

	const addRNGSettings = (newSettings: RNGCircleRendererSettings) => {
		setRNGSettingsList((prev) => [...prev, newSettings]);
	};

	const updateRNGSettings = (updatedSettings: Partial<RNGCirclesSettings>) => {
		setRNGSettingsList((prev) =>
			prev.map((settings) =>
				settings.id === id
					? {
							...settings,
							rngSettings: { ...settings.rngSettings, ...updatedSettings },
						}
					: settings,
			),
		);
	};

	const removeRNGSettings = () => {
		setRNGSettingsList((prev) => prev.filter((s) => s.id !== id));
	};

	return (
		<RandomCircleContext.Provider
			value={{
				rngSettingsList,
				addRNGSettings,
				updateRNGSettings,
				removeRNGSettings,
				setRNGSettingsList,
				currentRNGSettings,
				setCurrentRNGSettings,
				updateCurrentRNGSettings,
			}}
		>
			{children}
		</RandomCircleContext.Provider>
	);
}

export function useRNGSettings() {
	const context = useContext(RandomCircleContext);
	if (!context) {
		throw new Error('useSettings must be used within a SettingsProvider');
	}
	return context;
}
