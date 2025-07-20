import {useCallback, useEffect, useRef, useState} from "react";
import Circle from "./Circle.tsx";
import {FourierTransform, ICircle, Point, ViewPort} from "@/model/model.ts";
import {getHslString, getViewPortString} from "@/components/fourier/helpers.ts";
import {useColorStrokeStore} from "@/store/color_stroke.store.ts";
import * as d3 from "d3";


type FourierWrapperProps = {
    isPause: boolean;
    viewPort: ViewPort;
    inputPath: Point[];
    id: string
}


const FourierTransformRenderer: React.FC<FourierWrapperProps> = ({
                                                                     isPause,
                                                                     viewPort,
                                                                     inputPath,
                                                                     id,
                                                                 }) => {
        const svgRef = useRef<SVGSVGElement>(null);
        const pathRef = useRef<SVGPathElement>(null);
        const [fourierSteps, setFourierSteps] = useState<FourierTransform[]>();
        const [circles, setCircles] = useState<ICircle[]>();
        const [currentFrequency, setCurrentFrequency] = useState(0);
        const [stepIncrement, setStepIncrement] = useState(0);
        const [animationSpeed, setAnimationSpeed] = useState(16.67);
        const [isCompleteCycle, setIsCompleteCycle] = useState(false);
        const currentColorSettings = useColorStrokeStore((state) => state.settingsMap[id].colorSettings);
        const currentStrokeSettings = useColorStrokeStore((state) => state.settingsMap[id].strokeSettings);

        const pathArrayRef = useRef<Point[]>([]);
        const renderPath = useCallback((
            x: number,
            y: number,
        ) => {
            if (!isCompleteCycle) {
                const graph = d3.select(pathRef.current);
                pathArrayRef.current.push({x, y});

                const pathData = pathArrayRef.current.map((point, index) => {
                    return index === 0 ? `M${point.x},${point.y}` : `L${point.x},${point.y}`;
                }).join(" ");

                graph.attr("d", pathData);
            }

        }, [isCompleteCycle]);


        const renderCircles = useCallback((step: number, currentFourier: FourierTransform[]): ICircle[] | undefined => {
            if (!currentFourier) {
                return undefined;
            }
            const newCircles: ICircle[] = [];
            let prevCircle: ICircle | null = null;

            for (let i = 0; i < currentFourier.length; i++) {
                const {radius, frequency, phase} = currentFourier[i];
                const angle = 2 * Math.PI * frequency * step + phase;
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

        const generateFourierProps = (
            points: Point[],
        ) => {
            const fourierPoints: FourierTransform[] = [];
            const N = points.length;
            for (let k = 0; k < N; k++) {
                const sum = {re: 0, im: 0};
                for (let n = 0; n < N; n++) {
                    const angle = (2 * Math.PI * k * n) / N;
                    sum.re += points[n].x * Math.cos(angle) + points[n].y * Math.sin(angle);
                    sum.im += -points[n].x * Math.sin(angle) + points[n].y * Math.cos(angle);
                }
                sum.re /= N;
                sum.im /= N;

                const amplitude = Math.sqrt(sum.re ** 2 + sum.im ** 2);
                const phase = Math.atan2(sum.im, sum.re);
                fourierPoints.push({radius: amplitude, frequency: k, phase: phase});
            }
            setStepIncrement(1 / fourierPoints.length)
            return fourierPoints;
        }

        useEffect(() => {
            setIsCompleteCycle(false);
            setCurrentFrequency(0);
            setStepIncrement(0);
            setFourierSteps(undefined)
            setCircles([]);
            setAnimationSpeed(16.67);
            if (inputPath) {
                const fourierCoefficient = generateFourierProps(inputPath);
                fourierCoefficient.sort((a, b) => {
                    return b.radius - a.radius;
                })
                setFourierSteps(fourierCoefficient);
                setCircles(renderCircles(0, fourierCoefficient));
            }
        }, [inputPath, renderCircles]);


        useEffect(() => {
            let animationFrameId: number;
            let lastUpdateTime = performance.now();

            const animate = () => {
                const now = performance.now();
                if (!isPause) {
                    if (now - lastUpdateTime >= animationSpeed) {
                        setCurrentFrequency(prevState => prevState + stepIncrement);
                        lastUpdateTime = now;
                    }
                    animationFrameId = requestAnimationFrame(animate);
                }
            };
            if (!isPause) {
                animationFrameId = requestAnimationFrame(animate);
            }
            return () => {
                cancelAnimationFrame(animationFrameId);
            };
        }, [isPause, fourierSteps, animationSpeed, stepIncrement]);

        useEffect(() => {
            if (!fourierSteps) {
                return;
            }
            if (currentFrequency >= 1) {
                setIsCompleteCycle(true);
            }
            const newCircles = renderCircles(currentFrequency, fourierSteps);
            setCircles(newCircles);
            if (newCircles && newCircles.length >= 1) {
                const last = newCircles[newCircles.length - 1];
                const endX = last.centerX + last.radius * Math.cos(last.angle);
                const endY = last.centerY + last.radius * Math.sin(last.angle);
                renderPath(endX, endY);
            }
        }, [currentFrequency, fourierSteps, renderCircles, renderPath]);


        return (
            <div className={'fourier-container'}>
                {currentColorSettings && currentStrokeSettings ?
                    <svg style={{backgroundColor: getHslString(currentColorSettings.backgroundColor)}} ref={svgRef}
                         width="100%" height="100%"
                         viewBox={getViewPortString(viewPort)}>
                        {circles && circles.length > 0 ? circles.map((item, index) => (
                            <Circle key={index} circle={item} strokeSettings={currentStrokeSettings}
                                    colorSettings={currentColorSettings}/>
                        )) : null}
                        {pathArrayRef.current.length > 0 ? <path ref={pathRef} strokeLinejoin={'round'}
                                                 stroke={getHslString(currentColorSettings.pathColor)}
                                                 fill="none"
                                                 strokeWidth={currentStrokeSettings.pathStroke}/> : null
                        }
                    </svg> : null
                }
            </div>
        )
    }
;

export default FourierTransformRenderer;
