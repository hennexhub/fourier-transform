import { useEffect, useRef, useState } from 'react';
import {
	ColorSettings,
	Point,
	StrokeSettings,
	ViewPort,
} from '@/model/model.ts';
import {
	getHslString,
	getViewPortString,
} from '@/components/fourier/helpers.ts';

type StaticSVGProps = {
	colors: ColorSettings;
	strokes: StrokeSettings;
	inputPath: Point[];
	viewPort: ViewPort;
};

const StaticSVGPathRenderer: React.FC<StaticSVGProps> = ({
	colors,
	strokes,
	inputPath,
	viewPort,
}) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const [path, setPath] = useState<string>('');

	useEffect(() => {
		if (inputPath && inputPath.length > 0) {
			const pathD =
				`M ${inputPath[0].x} ${inputPath[0].y} ` +
				inputPath
					.slice(1)
					.map((p) => `L ${p.x} ${p.y}`)
					.join(' ');
			setPath(pathD);
		}
	}, [colors, strokes, path]);

	return (
		<div className={'svg-container w-full h-full'}>
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
				<path
					d={path}
					stroke={getHslString(colors.pathColor)}
					fill="none"
					strokeWidth={strokes.pathStroke}
				/>
			</svg>
		</div>
	);
};

export default StaticSVGPathRenderer;
