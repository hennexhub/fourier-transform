import { useEffect, useRef, useState } from 'react';
import { HslColor, HslColorPicker } from 'react-colorful';
import { debounce } from 'lodash';

export const ColorPicker = ({
	color,
	setColor,
	label,
}: {
	color: number[];
	setColor: (color: HslColor) => void;
	label: string;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const pickerRef = useRef<HTMLDivElement>(null);
	const [tempColor, setTempColor] = useState({
		h: color[0],
		s: color[1],
		l: color[2],
	});

	const debouncedUpdateColor = debounce((newColor: HslColor) => {
		setColor(newColor);
	}, 100);

	const handleColorChange = (newColor: HslColor) => {
		setTempColor(newColor);
		debouncedUpdateColor(newColor);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				pickerRef.current &&
				!pickerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const getHslString = (hsl: number[]): string => {
		return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
	};
	return (
		<div>
			<div
				className=" flex w-full justify-between items-center"
				ref={pickerRef}
			>
				<div className="font-sans text-xs font-medium text-black">{label}</div>
				<div
					className="w-5 h-5 border border-gray-400 cursor-pointer"
					style={{ backgroundColor: getHslString(color) }}
					onClick={() => setIsOpen(!isOpen)}
				/>
				{isOpen && (
					<div className="absolute z-[900] top-5 bottom-full mb-2 p-2 bg-white shadow-lg border rounded">
						<HslColorPicker color={tempColor} onChange={handleColorChange} />
					</div>
				)}
			</div>
		</div>
	);
};
