import { Slider } from '@/components/ui/slider.tsx';
import { Label } from '@radix-ui/react-label';
import { useState } from 'react';
import { Tooltip } from '@heroui/tooltip';
import QuestionMarkIcon from '@/components/ui/icons/QuestionMarkIcon.tsx';

export const SliderWithNumber = ({
	number,
	setNumber,
	min,
	max,
	steps,
	label,
	toolTipText,
}: {
	number: number;
	setNumber: (value: number[]) => void;
	min: number;
	max: number;
	steps: number;
	label: string;
	toolTipText: string | undefined;
}) => {
	const [isDragging, setIsDragging] = useState(false);

	const handleMouseDown = () => {
		setIsDragging(true);
	};
	const handleMouseUp = () => setIsDragging(false);

	const handleWheel = (event: React.WheelEvent) => {
		const delta = event.deltaY > 0 ? -steps : steps;
		let newValue = Math.min(max, Math.max(min, number + delta));
		newValue = parseFloat(newValue.toFixed(3));
		setNumber([newValue]);
	};
	const handleChange = (value: number[]) => {
		setNumber([...value]);
	};

	return (
		<div className={'flex flex-col gap-[.5em] items-center justify-center'}>
			<div className={'flex w-full justify-between items-center'}>
				<div className={'flex flex-row '}>
					<div className={'flex flex-row gap-1 justify-center'}>
						<Label
							className="font-sans text-xs font-medium text-black"
							htmlFor={'number-slider' + '-' + label}
							aria-checked={'true'}
						>
							{label}
						</Label>
						{toolTipText ? (
							<Tooltip
								className={'text-black z-[999] w-[21em] '}
								delay={600}
								content={toolTipText}
								showArrow={true}
							>
								<span className={' relative text-black cursor-pointer '}>
									<QuestionMarkIcon />
								</span>
							</Tooltip>
						) : null}
					</div>
				</div>
				<span className="font-sans text-xs font-medium text-black">
					{number}
				</span>
			</div>
			<Slider
				className={isDragging ? 'cursor-grabbing' : 'cursor-pointer'}
				onPointerDown={handleMouseDown}
				onPointerUp={handleMouseUp}
				onMouseLeave={handleMouseUp}
				onWheelCapture={handleWheel}
				value={[number]}
				max={max}
				min={min}
				step={steps}
				onValueChange={handleChange}
				id={'number-slider' + '-' + label}
			/>
		</div>
	);
};
