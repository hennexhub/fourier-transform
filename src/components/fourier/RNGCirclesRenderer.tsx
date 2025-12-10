import { useEffect, useRef, useState } from 'react';
import Circle from './Circle.tsx';
import { FourierTransform, ICircle, Point, ViewPort } from '@/model/model.ts';
import {
	getHslString,
	getRandomNumber,
	getViewPortString,
	renderPath,
} from '@/components/fourier/helpers.ts';
import { useRNGSettings } from '@/context/RNGSettingsContext.tsx';
import { useSettings } from '@/context/SettingsContext.tsx';

type FourierWrapperProps = {
	isPause: boolean;
	viewPort: ViewPort;
	id: string;
};

const RNGCirclesRenderer: React.FC<FourierWrapperProps> = ({
	isPause,
	viewPort,
}) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const pathRef = useRef<SVGPathElement>(null);
	const [fourierSteps, setFourierSteps] = useState<FourierTransform[]>();
	const [circles, setCircles] = useState<ICircle[]>();
	const [currentFrequency, setCurrentFrequency] = useState(0);
	const [path, setPath] = useState<Point[]>([]);
	const [newViewPort, setNewViewPort] = useState<ViewPort>(viewPort);
	const [savedElapsed, setSavedElapsed] = useState(0);
	const { currentRNGSettings } = useRNGSettings();
	const { currentStrokeSettings, currentColorSettings } = useSettings();

	useEffect(() => {
		if (!currentRNGSettings) {
			return;
		}
		const fourierPoints: FourierTransform[] = [];
		setCurrentFrequency(() => 0);
		setFourierSteps(undefined);
		setSavedElapsed(() => 0);
		setPath(() => []);
		setNewViewPort(newViewPort);
		generateRandomFourierProps(fourierPoints);
		setFourierSteps(fourierPoints);
		setCircles(renderCircles(savedElapsed, fourierPoints));
	}, [currentRNGSettings]);

	const generateRandomFourierProps = (fourierProps: FourierTransform[]) => {
		if (!currentRNGSettings) {
			return;
		}
		for (let i = 0; i < currentRNGSettings.numberOfCircles; i++) {
			const radius = parseFloat(
				getRandomNumber(
					0.1,
					currentRNGSettings.maxRadius,
					currentRNGSettings.radiusDelta,
				).toFixed(3),
			);
			const phase = parseFloat(
				getRandomNumber(
					1,
					currentRNGSettings.maxRadius,
					currentRNGSettings.radiusDelta,
				).toFixed(3),
			);
			const min = currentRNGSettings.minSpeed;
			const max = currentRNGSettings.maxSpeed;
			const frequency = parseFloat(
				getRandomNumber(min, max, currentRNGSettings.speedDelta).toFixed(3),
			);
			fourierProps.push({ radius: radius, frequency: frequency, phase: phase });
		}
		if (currentRNGSettings.sortCircles) {
			fourierProps.sort((a, b) => {
				return b.radius - a.radius;
			});
		}
		return fourierProps;
	};

	useEffect(() => {
		let animationFrameId: number;
		let startTime: number | null = null;
		if (!isPause) {
			startTime = performance.now();
			const animate = () => {
				if (!startTime) {
					startTime = 0;
				}
				const elapsed = performance.now() - startTime + savedElapsed;
				setCurrentFrequency(elapsed / 1000);
				animationFrameId = requestAnimationFrame(animate);
			};
			animationFrameId = requestAnimationFrame(animate);
		} else if (isPause) {
			setSavedElapsed(currentFrequency * 1000);
		}
		return () => {
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
		};
	}, [isPause]);

	useEffect(() => {
		if (!fourierSteps) {
			return;
		}
		if (
			currentStrokeSettings &&
			currentStrokeSettings.deletePath &&
			currentFrequency >
				currentStrokeSettings.deletePathDelay + savedElapsed / 1000
		) {
			path.splice(0, 1);
		}
		setCircles(renderCircles(currentFrequency, fourierSteps));
	}, [currentFrequency]);

	const renderCircles = (
		step: number,
		currentFourier: FourierTransform[],
	): ICircle[] | undefined => {
		if (!currentFourier) {
			return undefined;
		}
		const newCircles: ICircle[] = [];
		let prevCircle: ICircle | null = null;

		for (let i = 0; i < currentFourier.length; i++) {
			const { radius, frequency } = currentFourier[i];
			const angle = Math.PI * frequency * step;
			const centerX = prevCircle
				? prevCircle.centerX + prevCircle.radius * Math.cos(prevCircle.angle)
				: 0;
			const centerY = prevCircle
				? prevCircle.centerY + prevCircle.radius * Math.sin(prevCircle.angle)
				: 0;
			const newCircle: ICircle = {
				centerX,
				centerY,
				radius,
				angle,
			};
			newCircles.push(newCircle);
			prevCircle = newCircle;
			if (i === currentFourier.length - 1 && !isPause) {
				const centerX =
					prevCircle.centerX + prevCircle.radius * Math.cos(angle);
				const centerY =
					prevCircle.centerY + prevCircle.radius * Math.sin(angle);
				renderPath(centerX, centerY, pathRef, setPath, path);
			}
		}
		return newCircles;
	};

	return (
		<div className={'fourier-container'}>
			{currentStrokeSettings && currentColorSettings ? (
				<svg
					style={{
						backgroundColor: getHslString(currentColorSettings.backgroundColor),
					}}
					ref={svgRef}
					width="100%"
					height="100%"
					viewBox={getViewPortString(newViewPort)}
				>
					{circles &&
					currentStrokeSettings &&
					currentColorSettings &&
					circles.length > 0
						? circles.map((item, index) => (
								<Circle
									key={index}
									circle={item}
									strokeSettings={currentStrokeSettings}
									colorSettings={currentColorSettings}
								/>
							))
						: null}
					{path.length > 0 ? (
						<path
							ref={pathRef}
							stroke={getHslString(currentColorSettings.pathColor)}
							fill="none"
							strokeWidth={currentStrokeSettings.pathStroke}
						/>
					) : null}
				</svg>
			) : null}
		</div>
	);
};

export default RNGCirclesRenderer;
