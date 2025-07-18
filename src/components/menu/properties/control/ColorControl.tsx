import {ColorPicker} from "@/components/menu/properties/control/components/ColorPicker.tsx";
import {useColorStrokeStore} from "@/store/color_stroke.store.ts";
import {HslColor} from "react-colorful";

const ColorControl = ({id}: { id: string }) => {
    const colorSettings = useColorStrokeStore((state) => state.settingsMap[id].colorSettings);
    const updateStrokeSettings = useColorStrokeStore((state) => state.updateColorSettings);

    const setCircleColor = (color: HslColor) => {
        updateStrokeSettings(id, {circleColor: [color.h, color.s, color.l]});
    };

    const setRadiusColor = (color: HslColor) => {
        updateStrokeSettings(id, {radiusColor: [color.h, color.s, color.l]});
    };

    const setJointPointColor = (color: HslColor) => {
        updateStrokeSettings(id, {jointPointColor: [color.h, color.s, color.l]});
    };

    const setBackgroundColor = (color: HslColor) => {
        updateStrokeSettings(id, {backgroundColor: [color.h, color.s, color.l]});
    };

    const setPathColor = (color: HslColor) => {
        updateStrokeSettings(id, {pathColor: [color.h, color.s, color.l]});
    };

    return (
        <>
            {colorSettings ?
                <div className={'flex flex-col gap-2.5'}>
                    <ColorPicker label={'Circle'} color={colorSettings.circleColor}
                                 setColor={(color) => setCircleColor(color)}/>
                    <ColorPicker label={'Radius'} color={colorSettings.radiusColor}
                                 setColor={setRadiusColor}/>
                    <ColorPicker label={'Joint point'} color={colorSettings.jointPointColor}
                                 setColor={setJointPointColor}/>
                    <ColorPicker label={'Background'} color={colorSettings.backgroundColor}
                                 setColor={setBackgroundColor}/>
                    <ColorPicker label={'Path'} color={colorSettings.pathColor}
                                 setColor={setPathColor}/>
                </div> : null
            }
        </>
    );
}

export default ColorControl;