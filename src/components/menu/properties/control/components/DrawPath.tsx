import { useRef, useState } from 'react';
import { Point } from '@/model/model.ts';

const DrawPath = ({ setPath }: { setPath: (path: Point[]) => void }) => {
	const [isDrawing, setIsDrawing] = useState(false);
	const [pathData, setPathData] = useState<Point[]>([]);
	const svgRef = useRef<SVGSVGElement | null>(null);

	const handleMouseDown = (e: {
		nativeEvent: { offsetX: number; offsetY: number };
	}) => {
		setIsDrawing(true);
		const { offsetX, offsetY } = e.nativeEvent;
		setPathData([{ x: offsetX, y: offsetY }]);
	};

	const handleMouseMove = (e: {
		nativeEvent: { offsetX: number; offsetY: number };
	}) => {
		if (!isDrawing) return;
		const { offsetX, offsetY } = e.nativeEvent;
		setPathData((prevData) => [...prevData, { x: offsetX, y: offsetY }]);
	};

	const handleMouseUp = () => {
		setIsDrawing(false);
		setPathData([]);
		setPath(pathData);
	};

	const drawPath = () => {
		if (pathData.length < 2) return '';
		return pathData
			.map((point, index) => {
				return index === 0
					? `M${point.x},${point.y}`
					: `L${point.x},${point.y}`;
			})
			.join(' ');
	};

	const handleTouchStart = (e: React.TouchEvent<SVGElement>) => {
		e.preventDefault();
		setIsDrawing(true);
		const { clientX, clientY } = e.touches[0];
		const { x, y } = getSVGCoords(clientX, clientY);
		setPathData([{ x, y }]);
	};

	const handleTouchMove = (e: React.TouchEvent<SVGElement>) => {
		if (!isDrawing) return;
		const { clientX, clientY } = e.touches[0];
		const { x, y } = getSVGCoords(clientX, clientY);
		setPathData((prevData) => [...prevData, { x, y }]);
	};

	const handleTouchEnd = () => {
		setIsDrawing(false);
		setPathData([]);
		setPath(pathData);
	};

	const getSVGCoords = (clientX: number, clientY: number) => {
		if (!svgRef.current) return { x: 0, y: 0 };
		const svg = svgRef.current;
		const point = svg.createSVGPoint();
		point.x = clientX;
		point.y = clientY;
		const { x, y } = point.matrixTransform(svg.getScreenCTM()?.inverse());
		return { x, y };
	};

	return (
		<div>
			<svg
				ref={svgRef}
				width="200"
				height="150"
				style={{ border: '1px solid black', position: 'relative' }}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseUp}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			>
				<path
					d={drawPath()}
					stroke="black"
					fill="transparent"
					strokeWidth="2"
				/>
			</svg>
		</div>
	);
};

export default DrawPath;
