import {useCallback, useEffect, useRef, useState} from 'react';
import {getHslString, getViewPortString, renderPath,} from '@/components/fourier/helpers.ts';
import {useSettings} from '@/context/SettingsContext.tsx';
import type {FourierTransform, ICircle, Point, ViewPort,} from '@/model/model.ts';
import Circle from './Circle.tsx';

type FourierWrapperProps = {
	isPause: boolean;
	viewPort: ViewPort;
	inputPath: Point[];
};

const FourierTransformRenderer: React.FC<FourierWrapperProps> = ({
	isPause,
	viewPort,
	inputPath,
}) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const pathRef = useRef<SVGPathElement>(null);
	const [fourierSteps, setFourierSteps] = useState<FourierTransform[]>();
	const [circles, setCircles] = useState<ICircle[]>();
	const [currentFrequency, setCurrentFrequency] = useState(0);
	const [path, setPath] = useState<Point[]>(inputPath);
	const [newViewPort, setNewViewPort] = useState<ViewPort>(viewPort);
	const [stepIncrement, setStepIncrement] = useState(0);
	const [animationSpeed, setAnimationSpeed] = useState(16.67);
	const [isCompleteCycle, setIsCompleteCycle] = useState(false);
	const { currentStrokeSettings, currentColorSettings } = useSettings();

	const generateFourierProps = useCallback((points: Point[]) => {
		const fourierPoints: FourierTransform[] = [];
		const N = points.length;
		for (let k = 0; k < N; k++) {
			const sum = { re: 0, im: 0 };
			for (let n = 0; n < N; n++) {
				const angle = (2 * Math.PI * k * n) / N;
				sum.re += points[n].x * Math.cos(angle) + points[n].y * Math.sin(angle);
				sum.im +=
					-points[n].x * Math.sin(angle) + points[n].y * Math.cos(angle);
			}
			sum.re /= N;
			sum.im /= N;

			const amplitude = Math.sqrt(sum.re ** 2 + sum.im ** 2);
			const phase = Math.atan2(sum.im, sum.re);
			fourierPoints.push({ radius: amplitude, frequency: k, phase: phase });
		}
		setStepIncrement(1 / fourierPoints.length);
		return fourierPoints;
	}, []);

	const renderCircles = useCallback(
		(
			step: number,
			currentFourier: FourierTransform[],
		): ICircle[] | undefined => {
			if (!currentFourier) {
				return undefined;
			}
			const newCircles: ICircle[] = [];
			let prevCircle: ICircle | null = null;

			for (let i = 0; i < currentFourier.length; i++) {
				const { radius, frequency, phase } = currentFourier[i];
				const angle = 2 * Math.PI * frequency * step + phase;
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
				if (i === currentFourier.length - 1) {
					const centerX = prevCircle
						? prevCircle.centerX + prevCircle.radius * Math.cos(angle)
						: 0;
					const centerY = prevCircle
						? prevCircle.centerY + prevCircle.radius * Math.sin(angle)
						: 0;
					if (!isCompleteCycle) {
						renderPath(centerX, centerY, pathRef, setPath, path);
					}
				}
			}
			return newCircles;
		},
		[isCompleteCycle, path],
	);

	useEffect(() => {
		setIsCompleteCycle(false);
		setCurrentFrequency(0);
		setStepIncrement(0);
		setFourierSteps(undefined);
		setPath([]);
		setCircles([]);
		setNewViewPort(viewPort);
		setAnimationSpeed(16.67);
		if (inputPath) {
			const fourierCoefficient = generateFourierProps(inputPath);
			fourierCoefficient.sort((a, b) => {
				return b.radius - a.radius;
			});
			setFourierSteps(fourierCoefficient);
			setCircles(renderCircles(0, fourierCoefficient));
		}
	}, [inputPath, generateFourierProps, renderCircles, viewPort]);

	useEffect(() => {
		let animationFrameId: number;
		let lastUpdateTime = performance.now();

		const animate = () => {
			const now = performance.now();
			if (!isPause) {
				if (now - lastUpdateTime >= animationSpeed) {
					setCurrentFrequency((prevState) => prevState + stepIncrement);
					lastUpdateTime = now;
				}
				animationFrameId = requestAnimationFrame(animate);
			}
		};
		if (!isPause) {
			animationFrameId = requestAnimationFrame(animate);
		}
		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, [isPause, fourierSteps, animationSpeed]);

	useEffect(() => {
		if (!fourierSteps) {
			return;
		}
		if (currentFrequency >= 1) {
			setIsCompleteCycle(true);
		}
		setCircles(renderCircles(currentFrequency, fourierSteps));
	}, [currentFrequency, fourierSteps]);

	return (
		<div className={'fourier-container'}>
			{currentColorSettings && currentStrokeSettings ? (
				<svg
					style={{
						backgroundColor: getHslString(currentColorSettings.backgroundColor),
					}}
					ref={svgRef}
					width="100%"
					height="100%"
					viewBox={getViewPortString(newViewPort)}
				>
					{circles && circles.length > 0
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
							strokeLinejoin={'round'}
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

export default FourierTransformRenderer;
