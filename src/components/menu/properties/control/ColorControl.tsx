import type { HslColor } from 'react-colorful';
import { ColorPicker } from '@/components/menu/properties/control/components/ColorPicker.tsx';
import { useSettings } from '@/context/SettingsContext.tsx';

const ColorControl = () => {
	const { updateCurrentColorSettings, currentColorSettings } = useSettings();

	const setCircleColor = (color: HslColor) => {
		updateCurrentColorSettings({ circleColor: [color.h, color.s, color.l] });
	};

	const setRadiusColor = (color: HslColor) => {
		updateCurrentColorSettings({ radiusColor: [color.h, color.s, color.l] });
	};

	const setJointPointColor = (color: HslColor) => {
		updateCurrentColorSettings({
			jointPointColor: [color.h, color.s, color.l],
		});
	};

	const setBackgroundColor = (color: HslColor) => {
		updateCurrentColorSettings({
			backgroundColor: [color.h, color.s, color.l],
		});
	};

	const setPathColor = (color: HslColor) => {
		updateCurrentColorSettings({ pathColor: [color.h, color.s, color.l] });
	};

	return (
		<>
			{currentColorSettings ? (
				<div className={'flex flex-col gap-2.5'}>
					<ColorPicker
						label={'Circle'}
						color={currentColorSettings.circleColor}
						setColor={(color) => setCircleColor(color)}
					/>
					<ColorPicker
						label={'Radius'}
						color={currentColorSettings.radiusColor}
						setColor={setRadiusColor}
					/>
					<ColorPicker
						label={'Joint point'}
						color={currentColorSettings.jointPointColor}
						setColor={setJointPointColor}
					/>
					<ColorPicker
						label={'Background'}
						color={currentColorSettings.backgroundColor}
						setColor={setBackgroundColor}
					/>
					<ColorPicker
						label={'Path'}
						color={currentColorSettings.pathColor}
						setColor={setPathColor}
					/>
				</div>
			) : null}
		</>
	);
};

export default ColorControl;
