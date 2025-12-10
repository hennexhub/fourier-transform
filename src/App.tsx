import './App.css';
import { useEffect, useState } from 'react';
import { HeroUIProvider } from '@heroui/react';
import { SettingsProvider } from './context/SettingsContext';
import { RNGSettingsContext } from '@/context/RNGSettingsContext.tsx';
import { ActiveRendererIdProvider } from '@/context/ActiveRendererContext.tsx';
import Main from '@/components/main/Main.tsx';

export const useWindowSize = () => {
	const [size, setSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		const handleResize = () =>
			setSize({ width: window.innerWidth, height: window.innerHeight });
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return size;
};

function App() {
	const { width, height } = useWindowSize();

	return (
		<>
			<HeroUIProvider>
				<ActiveRendererIdProvider>
					<SettingsProvider>
						<RNGSettingsContext>
							<main>
								<Main width={width} height={height} />
							</main>
						</RNGSettingsContext>
					</SettingsProvider>
				</ActiveRendererIdProvider>
			</HeroUIProvider>
		</>
	);
}

export default App;
