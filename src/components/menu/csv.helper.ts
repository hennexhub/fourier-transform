import { Point } from '@/model/model.ts';

export const getInputCanvasDimension = (
	path: Point[]
):
	| {
			leftmostPoint: number;
			rightMostPoint: number;
			bottommostPoint: number;
			topmostPoint: number;
	  }
	| undefined => {
	if (!path || path.length === 0) {
		return undefined;
	}
	let rightMostPoint = path[0].x;
	let leftmostPoint = path[0].x;
	let bottommostPoint = path[0].y;
	let topmostPoint = path[0].y;

	for (const num of path) {
		if (num.x < leftmostPoint) {
			leftmostPoint = num.x;
		}
		if (num.x > rightMostPoint) {
			rightMostPoint = num.x;
		}
		if (num.y < bottommostPoint) {
			bottommostPoint = num.y;
		}
		if (num.y > topmostPoint) {
			topmostPoint = num.y;
		}
	}
	return {
		leftmostPoint: leftmostPoint,
		rightMostPoint: rightMostPoint,
		bottommostPoint: bottommostPoint,
		topmostPoint: topmostPoint,
	};
};

export const transformNumberArrayToDimensions = (
	inputPathData: number[][],
	width: number,
	height: number
) => {
	const transformedPath: Point[] = inputPathData.map(([x, y]) => ({
		x: x,
		y: y,
	}));
	return transformPathToDimensions(transformedPath, width, height);
};

export const transformPathToDimensions = (
	inputPathData: Point[],
	width: number,
	height: number
) => {
	const inputCanvasDimension = getInputCanvasDimension(inputPathData);
	if (inputCanvasDimension) {
		const { leftmostPoint, rightMostPoint, bottommostPoint, topmostPoint } =
			inputCanvasDimension;
		const marginFactor = 0.9;
		const maxWidth = width * marginFactor;
		const maxHeight = height * marginFactor;

		const inputHeight = topmostPoint - bottommostPoint;
		const inputWidth = rightMostPoint - leftmostPoint;

		const centerX = rightMostPoint - inputWidth / 2;
		const centerY = topmostPoint - inputHeight / 2;

		const inputAspectRatio = inputWidth / inputHeight;
		const canvasAspectRatio = width / height;

		let scale: number;
		if (inputAspectRatio > canvasAspectRatio) {
			scale = maxWidth / inputWidth;
		} else {
			scale = maxHeight / inputHeight;
		}
		const transformedPath: Point[] = inputPathData.map((point) => ({
			x: (point.x - centerX) * scale,
			y: (point.y - centerY) * scale,
		}));
		return transformedPath;
	}
};
