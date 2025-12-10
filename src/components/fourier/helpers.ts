import {
	ColorSettings,
	Point,
	RNGCirclesSettings,
	ViewPort,
} from '@/model/model.ts';
import * as d3 from 'd3';

export const generateHSLSteps = (
	startColor: number[],
	step: number,
	properties: RNGCirclesSettings
): [number, number, number][] => {
	const [h, s, l] = startColor;
	const colors: [number, number, number][] = [];
	for (let i = 0; i < properties.numberOfCircles; i++) {
		const newL = Math.min(100, l + i * step);
		colors.push([h, s, newL]);
	}
	return colors;
};

export const getRandomNumber = (min: number, max: number, delta: number) => {
	if (Math.random() < 1 / 20) {
		return Math.random() * (max + delta - min + delta * -1) + min + delta;
	} else {
		return Math.random() * (max - min) + min;
	}
};

export const getHslString = (hsl: number[]): string => {
	return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
};

export const getViewPortString = (viewPort: ViewPort) => {
	return `${viewPort.minX} ${viewPort.minY} ${viewPort.width} ${viewPort.height}`;
};

export const renderPath = (
	x: number,
	y: number,
	pathRef: React.RefObject<SVGPathElement | null>,
	setPath: React.Dispatch<React.SetStateAction<Point[]>>,
	path: Point[]
) => {
	if (!pathRef) {
		return;
	}
	const graph = d3.select(pathRef.current);
	setPath((prevPath) => [...prevPath, { x, y }]);
	const pathData = path
		.map((point, index) => {
			return index === 0 ? `M${point.x},${point.y}` : `L${point.x},${point.y}`;
		})
		.join(' ');
	graph.attr('d', pathData);
};

export const cycleCircleColor = (
	frequency: number,
	colors: ColorSettings,
	circleColorArray: [number, number, number][],
	properties: RNGCirclesSettings
) => {
	if (frequency % 10 > 0 && frequency % 10 < 1 && colors.rotateCircleColor) {
		for (let i = 0; i < circleColorArray.length; i++) {
			const generateNewColors = generateHSLSteps([90, 30, 30], 1.5, properties);
			circleColorArray[circleColorArray.length - i - 1] = generateNewColors[i];
		}
	}
};
