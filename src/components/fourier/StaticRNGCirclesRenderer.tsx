import { useEffect, useRef, useState } from 'react';
import {
	ColorSettings,
	FourierTransform,
	ICircle,
	Point,
	RNGCirclesSettings,
	StrokeSettings,
	ViewPort,
} from '@/model/model.ts';
import {
	getHslString,
	getRandomNumber,
	getViewPortString,
	renderPath,
} from '@/components/fourier/helpers.ts';
import Circle from '@/components/fourier/Circle.tsx';

type StaticSVGProps = {
	properties: RNGCirclesSettings;
	colors: ColorSettings;
	strokes: StrokeSettings;
	viewPort: ViewPort;
};

const StaticRNGCirclesRenderer: React.FC<StaticSVGProps> = ({
	properties,
	colors,
	strokes,
	viewPort,
}) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const pathRef = useRef<SVGPathElement>(null);
	const [circles, setCircles] = useState<ICircle[]>();
	const [path, setPath] = useState<Point[]>([]);

	useEffect(() => {
		const fourierPoints: FourierTransform[] = [];
		setCircles(renderCircles(10, generateRandomFourierProps(fourierPoints)));
	}, [properties]);

	const generateRandomFourierProps = (fourierProps: FourierTransform[]) => {
		for (let i = 0; i < properties.numberOfCircles; i++) {
			const radius = parseFloat(
				getRandomNumber(
					1,
					properties.maxRadius,
					properties.radiusDelta,
				).toFixed(3),
			);
			const phase = parseFloat(
				getRandomNumber(
					1,
					properties.maxRadius,
					properties.radiusDelta,
				).toFixed(3),
			);
			const min = properties.minSpeed;
			const max = properties.maxSpeed;
			const frequency = parseFloat(
				getRandomNumber(min, max, properties.speedDelta).toFixed(3),
			);
			fourierProps.push({ radius: radius, frequency: frequency, phase: phase });
		}
		return fourierProps;
	};

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
			if (i === currentFourier.length - 1) {
				const centerX = prevCircle
					? prevCircle.centerX + prevCircle.radius * Math.cos(angle)
					: 0;
				const centerY = prevCircle
					? prevCircle.centerY + prevCircle.radius * Math.sin(angle)
					: 0;
				renderPath(centerX, centerY, pathRef, setPath, path);
			}
		}
		return newCircles;
	};

	return (
		<div className={'fourier-container'}>
			<svg
				style={{
					backgroundColor: getHslString(colors.backgroundColor),
					position: 'relative',
				}}
				ref={svgRef}
				width="100%"
				height="100%"
				viewBox={getViewPortString(viewPort)}
			>
				{circles && circles.length > 0
					? circles.map((item, index) => (
							<Circle
								key={index}
								circle={item}
								strokeSettings={strokes}
								colorSettings={colors}
							/>
						))
					: null}
				{path.length > 0 ? (
					<path
						ref={pathRef}
						stroke={getHslString(colors.pathColor)}
						fill="none"
						strokeWidth={strokes.pathStroke}
					/>
				) : null}
			</svg>
		</div>
	);
};
export default StaticRNGCirclesRenderer;
