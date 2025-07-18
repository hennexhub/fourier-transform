import {useEffect, useState} from "react";
import RNGCirclesRenderer from "@/components/fourier/RNGCirclesRenderer.tsx";
import {Point, ViewPort} from "@/model/model.ts";
import FourierTransformRenderer from "@/components/fourier/FourierTransformRenderer.tsx";
import {useRNGSettingsStore} from "@/store/rng_settings.store.ts";


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