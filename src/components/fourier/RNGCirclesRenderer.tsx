import {useCallback, useEffect, useRef, useState} from "react";
import Circle from "./Circle.tsx";
import {FourierTransform, ICircle, Point, ViewPort} from "@/model/model.ts";
import {getHslString, getRandomNumber, getViewPortString} from "@/components/fourier/helpers.ts";
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
        const [path, setPath] = useState<Point[]>([]);
        const [savedElapsed, setSavedElapsed] = useState(0);
        const currentRNGSettings = useRNGSettingsStore((state) => state.rngSettingsMap[id]);
        const {colorSettings, strokeSettings} = useColorStrokeStore((state) => state.settingsMap[id]);
        const pathArrayRef = useRef<Point[]>([]);


        const addToPath = (point: Point) => {
            setPath(prev => {
                const updated = [...prev, point];
                pathArrayRef.current = updated;
                return updated;
            });
        };


        const renderPath = useCallback((
            x: number,
            y: number,
        ) => {
            if (!pathRef.current) return;

            const graph = d3.select(pathRef.current);
            addToPath({x, y});

            const pathData = pathArrayRef.current.map((point, index) => {
                return index === 0 ? `M${point.x},${point.y}` : `L${point.x},${point.y}`;
            }).join(" ");

            graph.attr("d", pathData);
        }, []);


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
            console.log('generateRandomFourierProps reruns');

            if (currentRNGSettings.sortCircles) {
                fourierProps.sort((a, b) => {
                    return b.radius - a.radius;
                });
            }
            return fourierProps
        }, [currentRNGSettings])


        const renderCircles = useCallback((step: number, currentFourier: FourierTransform[]): ICircle[] | undefined => {
            if (!currentFourier) {
                return undefined;
            }
            const newCircles: ICircle[] = [];
            let prevCircle: ICircle | null = null;

            for (let i = 0; i < currentFourier.length; i++) {
                const {radius, frequency} = currentFourier[i];
                const angle = Math.PI * frequency * step;
                const centerX = prevCircle ? prevCircle.centerX + prevCircle.radius * Math.cos(prevCircle.angle) : 0;
                const centerY = prevCircle ? prevCircle.centerY + prevCircle.radius * Math.sin(prevCircle.angle) : 0;
                const newCircle: ICircle = {
                    centerX,
                    centerY,
                    radius,
                    angle,
                };
                newCircles.push(newCircle);
                prevCircle = newCircle;
            }
            return newCircles;
        }, [])

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


        useEffect(() => {
            if (isPause) {
                setSavedElapsed(() => currentFrequency * 1000);
            }
        }, [currentFrequency, isPause]);

        useEffect(() => {
            if (!currentRNGSettings) return;

            const fourierPoints: FourierTransform[] = [];
            generateRandomFourierProps(fourierPoints);
            setFourierSteps(fourierPoints);
            setCurrentFrequency(0);
            setSavedElapsed(0);
            setPath([]);
        }, [currentRNGSettings, generateRandomFourierProps]);


        useEffect(() => {
            if (!fourierSteps) {
                return;
            }
            if (strokeSettings && strokeSettings.deletePath && currentFrequency > strokeSettings.deletePathDelay + savedElapsed / 1000) {
                setPath(prev => prev.slice(1));
            }

            const newCircles = renderCircles(currentFrequency, fourierSteps);
            setCircles(newCircles);
            if (newCircles && newCircles.length >= 1) {
                const last = newCircles[newCircles.length - 1];
                const endX = last.centerX + last.radius * Math.cos(last.angle);
                const endY = last.centerY + last.radius * Math.sin(last.angle);
                renderPath(endX, endY);
            }

        }, [currentFrequency, strokeSettings, fourierSteps, renderCircles, renderPath, savedElapsed]);


        return (
            <div className={'fourier-container'}>
                {strokeSettings && strokeSettings ?
                    <svg style={{backgroundColor: getHslString(colorSettings.backgroundColor)}} ref={svgRef}
                         width="100%" height="100%"
                         viewBox={getViewPortString(viewPort)}>
                        {circles && strokeSettings && colorSettings && circles.length > 0 ? circles.map((item, index) => (
                            <Circle key={index} circle={item} strokeSettings={strokeSettings}
                                    colorSettings={colorSettings}/>
                        )) : null}
                        {path.length > 0 ? <path ref={pathRef}
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
