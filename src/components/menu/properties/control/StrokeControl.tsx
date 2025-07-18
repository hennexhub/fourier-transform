import {SliderWithNumber} from "@/components/menu/properties/control/components/SliderWithNumber.tsx";
import {Switch} from "@heroui/switch";
import {Label} from "@/components/ui/label.tsx";
import {useColorStrokeStore} from "@/store/color_stroke.store.ts";


const StrokeControl = ({id}: { id: string }) => {
    const strokeSettings = useColorStrokeStore((state) => state.settingsMap[id].strokeSettings);
    const updateStrokeSettings = useColorStrokeStore((state) => state.updateStrokeSettings);

    const setCircleStroke = (value: number[]) => {
        updateStrokeSettings(id, {circleStroke: value[0]});
    };

    const setPathStroke = (value: number[]) => {

        updateStrokeSettings(id, {pathStroke: value[0]});

    };

    const setRadiusStroke = (value: number[]) => {
        updateStrokeSettings(id, {radiusStroke: value[0]});

    };

    const setJointPointStroke = (value: number[]) => {
        updateStrokeSettings(id, {jointPointStroke: value[0]});

    };

    const setDeletePathDelay = (value: number[]) => {
        updateStrokeSettings(id, {deletePathDelay: value[0]});

    };

    const setDeletePath = (value: boolean) => {
        updateStrokeSettings(id, {deletePath: value});
    };

    return (
        <>
            {strokeSettings ?
                <div className={'flex flex-col gap-2.5'}>
                    <SliderWithNumber number={strokeSettings.circleStroke} setNumber={setCircleStroke}
                                      min={0} max={5}
                                      steps={0.1} label={'Circle stroke'} toolTipText={undefined}/>
                    <SliderWithNumber number={strokeSettings.pathStroke} setNumber={setPathStroke} min={0}
                                      max={5}
                                      steps={0.1} label={'Path stroke'} toolTipText={undefined}/>
                    <SliderWithNumber number={strokeSettings.radiusStroke} setNumber={setRadiusStroke}
                                      min={0} max={5}
                                      steps={0.1} label={'Radius stroke'} toolTipText={undefined}/>
                    <SliderWithNumber number={strokeSettings.jointPointStroke}
                                      setNumber={setJointPointStroke} min={0} max={5}
                                      steps={0.1} label={'Joint point stroke'} toolTipText={undefined}/>
                    <Switch size="sm" className={'mt-2 mb-2'} color={'default'} onValueChange={setDeletePath}
                            isSelected={strokeSettings.deletePath}>
                        <Label>Delete Path</Label>
                    </Switch>
                    {strokeSettings.deletePath ?
                        <SliderWithNumber
                            toolTipText={'number of seconds after which the end of the path will be deleted. Only applies when the animations starts.'}
                            number={strokeSettings.deletePathDelay}
                            setNumber={setDeletePathDelay} min={0} max={20}
                            steps={1} label={'Delete path delay'}/> : null}
                </div>
                : null
            }
        </>
    );
}

export default StrokeControl;