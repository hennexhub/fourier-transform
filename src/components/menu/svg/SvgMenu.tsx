import {Point} from "@/model/model.ts";
import {useEffect, useRef, useState} from "react";
import Papa from "papaparse";
import StaticSVGPathRenderer from "@/components/fourier/StaticSVGPathRenderer.tsx";
import {transformNumberArrayToDimensions} from "@/components/menu/csv.helper.ts";
import {useColorStrokeStore} from "@/store/color_stroke.store.ts";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {useIsMobile} from "@/hooks/use-mobile.tsx";


interface CsvRow {
    [key: string]: string;
}

const fileNames = ['chess.csv', 'star.csv', 'wildForm.csv'];


export const SvgMenu = ({
                            setPath, id
                        }: {
    setPath: (path: Point[]) => void, id: string
}) => {
    const [pathArray, setPathArray] = useState<Point[][]>([]);
    const dataFetched = useRef(false);
    const isMobile = useIsMobile();
    const currentColorSettings = useColorStrokeStore((state) => state.settingsMap[id].colorSettings);
    const currentStrokeSettings = useColorStrokeStore((state) => state.settingsMap[id].strokeSettings);


    const fetchCSV = async (fileName: string) => {
        const response = await fetch('/csv/' + fileName);
        return await response.text();
    };


    useEffect(() => {
        if (dataFetched.current) return;
        dataFetched.current = true;

        Promise.all(fileNames.map(fetchCSV))
            .then((texts) => {
                const parsedPaths = texts.map(text => {
                    const parsed = Papa.parse<CsvRow>(text, {
                        delimiter: ";",
                        header: false,
                        skipEmptyLines: true,
                        dynamicTyping: true
                    });
                    let inputPathData: number[][] = parsed.data.map(row => {
                        const values = Object.values(row).map(Number);
                        return [values[0], values[1]];
                    }).filter(([x, y]) => !isNaN(x) && !isNaN(y));

                    if (inputPathData.length > 1000) {
                        let pathLength = inputPathData.length;
                        while (pathLength > 1000) {
                            inputPathData = shrinkPathData(inputPathData);
                            pathLength = inputPathData.length;
                        }
                    }
                    return transformNumberArrayToDimensions(inputPathData, 400, 200);
                });

                if (parsedPaths) {
                    setPathArray(parsedPaths as Point[][]);
                }
            });
    }, []);

    const shrinkPathData = (inputPathData: number[][]) => {
        const newPath: number[][] = [];
        for (let i = 0; i < inputPathData.length; i++) {
            if (i % 2 === 0) {
                newPath.push(inputPathData[i]);
            }
        }
        return newPath;
    };


    return (
        <>
            <div className={'mt-20 z-[999]'}>
                {pathArray && pathArray.length > 0 ?
                    <Carousel
                        id={'path-carousel'}
                        opts={{
                            align: "start",
                        }}
                        orientation={isMobile ? "horizontal" : 'vertical'}
                        className="w-full max-w-xs"
                    >
                        <CarouselContent className="-mt-1 h-[170px]">
                            {pathArray.map((path, index) => (
                                <CarouselItem key={index} className="pt-1 md:basis-1/2">
                                    <div onClick={() => setPath(path)} className="p-1 cursor-pointer ">
                                        <Card>
                                            <CardContent className="flex items-center justify-center p-6 h-full w-full">
                                                {currentStrokeSettings && currentColorSettings ?
                                                    <StaticSVGPathRenderer colors={currentColorSettings}
                                                                           inputPath={path}
                                                                           strokes={currentStrokeSettings} viewPort={{
                                                        minY: -100,
                                                        minX: -200,
                                                        height: 200,
                                                        width: 400
                                                    }}/> : null
                                                }
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious id={'path-carousel'}/>
                        <CarouselNext/>
                    </Carousel> : null
                }
            </div>
        </>
    );
};
