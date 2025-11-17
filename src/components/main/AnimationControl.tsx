import {useEffect, useState} from "react";
import RNGCirclesRenderer from "@/components/fourier/RNGCirclesRenderer.tsx";
import {ColorSettings, Point, RNGCirclesSettings, StrokeSettings, ViewPort} from "@/model/model.ts";
import FourierTransformRenderer from "@/components/fourier/FourierTransformRenderer.tsx";
import {useRNGSettingsStore} from "@/store/rng_settings.store.ts";

export interface ShareableSettings {
    rng: RNGCirclesSettings;
    stroke: StrokeSettings;
    color: ColorSettings;
}


// decides what to render, provides height and width limits,
const AnimationControl = ({width, height, id, isPause, path}: {
    width: number,
    height: number,
    id: string,
    isPause: boolean,
    path?: Point[]
}) => {
    const [viewPort, setViewPort] = useState<ViewPort>();
    const currentRNGSettings = useRNGSettingsStore((state) => state.rngSettingsMap[id])

    useEffect(() => {
        setViewPort({
            minX: -width / 2,
            minY: -height / 2,
            height: height,
            width: width
        })
    }, [height, width]);

    return (
        <>
            {viewPort && path ?
                <>
                    <FourierTransformRenderer isPause={isPause} viewPort={viewPort} inputPath={path} id={id}/>
                </> :
                <>
                    {currentRNGSettings && viewPort ?
                        <>
                            <RNGCirclesRenderer isPause={isPause} viewPort={viewPort} id={id}/>
                        </>
                        : null
                    }
                </>
            }
        </>
    );
}

export default AnimationControl;