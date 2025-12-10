import { SliderWithNumber } from '@/components/menu/properties/control/components/SliderWithNumber.tsx';
import { useSettings } from '@/context/SettingsContext.tsx';
import { Switch } from '@heroui/switch';
import { Label } from '@/components/ui/label.tsx';

const StrokeControl = () => {
	const { updateCurrentStrokeSettings, currentStrokeSettings } = useSettings();

	const setCircleStroke = (value: number[]) => {
		updateCurrentStrokeSettings({ circleStroke: value[0] });
	};

	const setPathStroke = (value: number[]) => {
		updateCurrentStrokeSettings({ pathStroke: value[0] });
	};

	const setRadiusStroke = (value: number[]) => {
		updateCurrentStrokeSettings({ radiusStroke: value[0] });
	};

	const setJointPointStroke = (value: number[]) => {
		updateCurrentStrokeSettings({ jointPointStroke: value[0] });
	};

	const setDeletePathDelay = (value: number[]) => {
		updateCurrentStrokeSettings({ deletePathDelay: value[0] });
	};

	const setDeletePath = (value: boolean) => {
		updateCurrentStrokeSettings({ deletePath: value });
	};

	return (
		<>
			{currentStrokeSettings ? (
				<div className={'flex flex-col gap-2.5'}>
					<SliderWithNumber
						number={currentStrokeSettings.circleStroke}
						setNumber={setCircleStroke}
						min={0}
						max={5}
						steps={0.1}
						label={'Circle stroke'}
						toolTipText={undefined}
					/>
					<SliderWithNumber
						number={currentStrokeSettings.pathStroke}
						setNumber={setPathStroke}
						min={0}
						max={5}
						steps={0.1}
						label={'Path stroke'}
						toolTipText={undefined}
					/>
					<SliderWithNumber
						number={currentStrokeSettings.radiusStroke}
						setNumber={setRadiusStroke}
						min={0}
						max={5}
						steps={0.1}
						label={'Radius stroke'}
						toolTipText={undefined}
					/>
					<SliderWithNumber
						number={currentStrokeSettings.jointPointStroke}
						setNumber={setJointPointStroke}
						min={0}
						max={5}
						steps={0.1}
						label={'Joint point stroke'}
						toolTipText={undefined}
					/>
					<Switch
						size="sm"
						className={'mt-2 mb-2'}
						color={'default'}
						onValueChange={setDeletePath}
						isSelected={currentStrokeSettings.deletePath}
					>
						<Label>Delete Path</Label>
					</Switch>
					{currentStrokeSettings.deletePath ? (
						<SliderWithNumber
							toolTipText={
								'number of seconds after which the end of the path will be deleted. Only applies when the animations starts.'
							}
							number={currentStrokeSettings.deletePathDelay}
							setNumber={setDeletePathDelay}
							min={0}
							max={20}
							steps={1}
							label={'Delete path delay'}
						/>
					) : null}
				</div>
			) : null}
		</>
	);
};

export default StrokeControl;
