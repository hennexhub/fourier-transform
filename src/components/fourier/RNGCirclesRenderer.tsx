import {useCallback, useEffect, useRef, useState} from "react";
import Circle from "./Circle.tsx";
import {FourierTransform, ICircle, Point, ViewPort} from "@/model/model.ts";
import {getHslString, getRandomNumber, getViewPortString, renderCircles} from "@/components/fourier/helpers.ts";
import * as d3 from "d3";
import {useRNGSettingsStore} from "@/store/rng_settings.store.ts";
import {useColorStrokeStore} from "@/store/color_stroke.store.ts";


type FourierWrapperProps = {
    isPause: boolean;
    viewPort: ViewPort;
    id: string
}


const RNGCirclesRenderer: React.FC<FourierWrapperProps> = ({
                                                               isPause,
                                                               viewPort,
                                                               id
                                                           }) => {
        const svgRef = useRef<SVGSVGElement>(null);
        const pathRef = useRef<SVGPathElement>(null);
        const [fourierSteps, setFourierSteps] = useState<FourierTransform[]>();
        const [circles, setCircles] = useState<ICircle[]>();
        const [currentFrequency, setCurrentFrequency] = useState(0);
        const [savedElapsed, setSavedElapsed] = useState(0);
        const currentRNGSettings = useRNGSettingsStore((state) => state.rngSettingsMap[id]);
        const {colorSettings, strokeSettings} = useColorStrokeStore((state) => state.settingsMap[id]);
        const pathArrayRef = useRef<Point[]>([]);

        // render the resulting path.
        const renderPath = useCallback((
            x: number,
            y: number,
        ) => {
            const graph = d3.select(pathRef.current);
            pathArrayRef.current.push({x, y});

            const pathData = pathArrayRef.current.map((point, index) => {
                return index === 0 ? `M${point.x},${point.y}` : `L${point.x},${point.y}`;
            }).join(" ");

            graph.attr("d", pathData);
        }, []);

        // calc circle props for rendering.
        const generateRandomFourierProps = useCallback((fourierProps: FourierTransform[]) => {
            if (!currentRNGSettings) {
                return;
            }
            for (let i = 0; i < currentRNGSettings.numberOfCircles; i++) {
                const radius = parseFloat((getRandomNumber(0.1, currentRNGSettings.maxRadius, currentRNGSettings.radiusDelta)).toFixed(3));
                const phase = parseFloat((getRandomNumber(1, currentRNGSettings.maxRadius, currentRNGSettings.radiusDelta)).toFixed(3));
                const min = currentRNGSettings.minSpeed;
                const max = currentRNGSettings.maxSpeed;
                const frequency = parseFloat(getRandomNumber(min, max, currentRNGSettings.speedDelta).toFixed(3));
                fourierProps.push({radius: radius, frequency: frequency, phase: phase});
            }

            if (currentRNGSettings.sortCircles) {
                fourierProps.sort((a, b) => {
                    return b.radius - a.radius;
                });
            }
            return fourierProps
        }, [currentRNGSettings])


        // animation loop
        useEffect(() => {
            let animationFrameId: number;
            let startTime: number | null = null;
            if (!isPause) {
                startTime = performance.now();
                const animate = () => {
                    if (!startTime) {
                        startTime = 0;
                    }
                    const elapsed = performance.now() - startTime + savedElapsed;
                    setCurrentFrequency(elapsed / 1000);
                    animationFrameId = requestAnimationFrame(animate);
                };
                animationFrameId = requestAnimationFrame(animate);
            }
            return () => {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
            };
        }, [isPause, savedElapsed]);

        // pause listener
        useEffect(() => {
            if (isPause) {
                setSavedElapsed(() => currentFrequency * 1000);
            }
        }, [currentFrequency, isPause]);

        // reset
        useEffect(() => {
            if (!currentRNGSettings) return;

            const fourierPoints: FourierTransform[] = [];
            generateRandomFourierProps(fourierPoints);
            setFourierSteps(fourierPoints);
            setCurrentFrequency(0);
            setSavedElapsed(0);
            pathArrayRef.current = [];
        }, [currentRNGSettings, generateRandomFourierProps]);

        // render
        useEffect(() => {
            if (!fourierSteps) {
                return;
            }
            if (strokeSettings && strokeSettings.deletePath && currentFrequency > strokeSettings.deletePathDelay + savedElapsed / 1000) {
                pathArrayRef.current = pathArrayRef.current.slice(1);
            }

            const newCircles = renderCircles(currentFrequency, fourierSteps);
            setCircles(newCircles);
            if (newCircles && newCircles.length >= 1) {
                const last = newCircles[newCircles.length - 1];
                const endX = last.centerX + last.radius * Math.cos(last.angle);
                const endY = last.centerY + last.radius * Math.sin(last.angle);
                renderPath(endX, endY);
            }

        }, [currentFrequency, strokeSettings, fourierSteps, renderPath, savedElapsed]);


        return (
            <div className={'fourier-container'}>
                {strokeSettings && colorSettings ?
                    <svg style={{backgroundColor: getHslString(colorSettings.backgroundColor)}} ref={svgRef}
                         width="100%" height="100%"
                         viewBox={getViewPortString(viewPort)}>
                        {circles && strokeSettings && colorSettings && circles.length > 0 ? circles.map((item, index) => (
                            <Circle key={index} circle={item} strokeSettings={strokeSettings}
                                    colorSettings={colorSettings}/>
                        )) : null}
                        {pathArrayRef.current.length > 0 ? <path ref={pathRef}
                                                 stroke={getHslString(colorSettings.pathColor)}
                                                 fill="none"
                                                 strokeWidth={strokeSettings.pathStroke}/> : null
                        }
                    </svg> : null
                }
            </div>
        )
    }
;

export default RNGCirclesRenderer;
