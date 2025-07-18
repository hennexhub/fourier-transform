import {SliderWithNumber} from "@/components/menu/properties/control/components/SliderWithNumber.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Switch} from "@heroui/switch";
import {useRNGSettingsStore} from "@/store/rng_settings.store.ts";

const RNGControl = ({id}: { id: string }) => {

    const updateRNGSettings = useRNGSettingsStore((state) => state.updateRNGSettings);
    const currentRNGSettings = useRNGSettingsStore((state) => state.rngSettingsMap[id]);

    const setNumberOfCircles = (value: number[]) => {
        updateRNGSettings(id, {numberOfCircles: value[0]});
    };

    const setMaxRadius = (value: number[]) => {
        updateRNGSettings(id,{maxRadius: value[0]});
    };

    const setRadiusDelta = (value: number[]) => {
        updateRNGSettings(id, {radiusDelta: value[0]});
    };

    const setMaxSpeed = (value: number[]) => {
        updateRNGSettings(id, {maxSpeed: value[0]});
    };

    const setMinSpeed = (value: number[]) => {
        updateRNGSettings(id, {minSpeed: value[0]});
    };

    const setSpeedDelta = (value: number[]) => {
        updateRNGSettings(id, {speedDelta: value[0]});
    };

    const setSortCircles = (value: boolean) => {
        updateRNGSettings(id, {sortCircles: value});
    };

    return (
        <>
            {currentRNGSettings ?
                <div className={'flex flex-col gap-3'}>
                    <SliderWithNumber number={currentRNGSettings.numberOfCircles} setNumber={setNumberOfCircles}
                                      min={0} max={200}
                                      steps={1} label={'numberOfCircles'} toolTipText={'the numbers of circles stacked on top of each other. High values may make the animation slower! '}/>
                    <SliderWithNumber number={currentRNGSettings.maxRadius} toolTipText={'A number between 0 and the value of maxRadius is randomly generated for each circle radius'} setNumber={setMaxRadius}
                                      min={0} max={300}
                                      steps={1} label={'maxRadius'}/>
                    <SliderWithNumber number={currentRNGSettings.radiusDelta} toolTipText={'There is a 5% chance that a the value of radiusDelta is applied to the circle radius'} setNumber={setRadiusDelta}
                                      min={0} max={150}
                                      steps={1} label={'radiusDelta'}/>
                    <SliderWithNumber number={currentRNGSettings.maxSpeed} toolTipText={'A number between minSpeed and maxSpeed is randomly generated for each circle spinning speed. Positive speed makes the circle go clock wise.'} setNumber={setMaxSpeed}
                                      min={0} max={1.5}
                                      steps={0.001} label={'maxSpeed'}/>
                    <SliderWithNumber number={currentRNGSettings.minSpeed} toolTipText={'A number between minSpeed and maxSpeed is randomly generated for each circle spinning speed. Negative speed makes the circle go counter clock wise.'} setNumber={setMinSpeed}
                                      min={-1.5} max={0}
                                      steps={0.001} label={'minSpeed'}/>
                    <SliderWithNumber number={currentRNGSettings.speedDelta}  toolTipText={'There is a 5% chance that a the value of speedDelta is applied to the circle spinning speed'} setNumber={setSpeedDelta}
                                      min={0} max={5}
                                      steps={0.1} label={'speedDelta'}/>
                    <Switch size="sm" className={'mt-2 mb-2'} color={'default'} onValueChange={setSortCircles} isSelected={currentRNGSettings.sortCircles}>
                        <Label>Sort Circles</Label>
                    </Switch>L
                </div> : null
            }
        </>
    );
}

export default RNGControl;