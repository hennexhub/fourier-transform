import {useCallback, useEffect, useRef, useState} from "react";
import {
    ColorSettings,
    FourierTransform,
    ICircle,
    Point,
    RNGCirclesSettings,
    StrokeSettings,
    ViewPort
} from "@/model/model.ts";
import {getHslString, getRandomNumber, getViewPortString, renderCircles} from "@/components/fourier/helpers.ts";
import Circle from "@/components/fourier/Circle.tsx";
import * as d3 from "d3";


type StaticSVGProps = {
    properties: RNGCirclesSettings;
    colors: ColorSettings;
    strokes: StrokeSettings;
    viewPort: ViewPort;
}


const StaticRNGCirclesRenderer: React.FC<StaticSVGProps> = ({
                                                                properties,
                                                                colors,
                                                                strokes,
                                                                viewPort,
                                                            }) => {
        const svgRef = useRef<SVGSVGElement>(null);
        const pathRef = useRef<SVGPathElement>(null);
        const [circles, setCircles] = useState<ICircle[]>();
        const [path, setPath] = useState<Point[]>([]);
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
            for (let i = 0; i < properties.numberOfCircles; i++) {
                const radius = parseFloat((getRandomNumber(1, properties.maxRadius, properties.radiusDelta)).toFixed(3));
                const phase = parseFloat((getRandomNumber(1, properties.maxRadius, properties.radiusDelta)).toFixed(3));
                const min = properties.minSpeed;
                const max = properties.maxSpeed;
                const frequency = parseFloat(getRandomNumber(min, max, properties.speedDelta).toFixed(3));
                fourierProps.push({radius: radius, frequency: frequency, phase: phase});
            }
            return fourierProps
        }, [properties.maxRadius, properties.maxSpeed, properties.minSpeed, properties.numberOfCircles, properties.radiusDelta, properties.speedDelta])



        useEffect(() => {
            const fourierPoints: FourierTransform[] = [];
            const newCircles = renderCircles(10, generateRandomFourierProps(fourierPoints));
            setCircles(newCircles);
            if (newCircles && newCircles.length >= 1) {
                const last = newCircles[newCircles.length - 1];
                const endX = last.centerX + last.radius * Math.cos(last.angle);
                const endY = last.centerY + last.radius * Math.sin(last.angle);
                renderPath(endX, endY);
            }
        }, [generateRandomFourierProps, renderPath]);


        return (
            <div className={'fourier-container'}>
                <svg style={{backgroundColor: getHslString(colors.backgroundColor), position: 'relative'}} ref={svgRef}
                     width="100%" height="100%"
                     viewBox={getViewPortString(viewPort)}>
                    {circles && circles.length > 0 ? circles.map((item, index) => (
                        <Circle key={index} circle={item} strokeSettings={strokes} colorSettings={colors}/>
                    )) : null}
                    {path.length > 0 ? <path ref={pathRef}
                                             stroke={getHslString(colors.pathColor)}
                                             fill="none"
                                             strokeWidth={strokes.pathStroke}/> : null
                    }
                </svg>
            </div>
        )
    }
;
export default StaticRNGCirclesRenderer;
