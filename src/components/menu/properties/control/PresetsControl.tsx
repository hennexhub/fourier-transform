import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {Preset, presets} from "@/presets.ts";
import StaticRNGCirclesRenderer from "@/components/fourier/StaticRNGCirclesRenderer.tsx";
import {useIsMobile} from "@/hooks/use-mobile.tsx";
import {useRNGSettingsStore} from "@/store/rng_settings.store.ts";
import {useColorStrokeStore} from "@/store/color_stroke.store.ts";

const PresetsControl = ({id}: { id: string }) => {

    const isMobile = useIsMobile();
    const updateRNGSettings = useRNGSettingsStore((state) => state.updateRNGSettings);
    const updateColorSettings = useColorStrokeStore((state) => state.updateColorSettings);
    const updateStrokeSettings = useColorStrokeStore((state) => state.updateStrokeSettings);

    const setPreset = (setting: Preset) => {
        console.log(setting);
        updateStrokeSettings(id, setting.strokes);
        updateColorSettings(id, setting.colors);
        updateRNGSettings(id, setting.rngSettings)
    }

    return (
        <div className={'mt-20 z-[999]'}>
            <Carousel
                opts={{
                    align: "start",
                }}
                orientation={isMobile ? "horizontal" : 'vertical'}
                className="w-full max-w-xs"
            >
                <CarouselContent className="-mt-1 h-[170px]">
                    {presets.map((setting, index) => (
                        <CarouselItem key={index} className="pt-1 md:basis-1/2">
                            <div onClick={() => setPreset(setting)} className="p-1 cursor-pointer">
                                <Card>
                                    <CardContent className="flex items-center justify-center p-6">
                                        <StaticRNGCirclesRenderer properties={setting.rngSettings}
                                                                  colors={setting.colors} strokes={setting.strokes}
                                                                  viewPort={{
                                                                      minY: -100,
                                                                      minX: -200,
                                                                      height: 200,
                                                                      width: 400
                                                                  }}/>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselNext/>

                <CarouselPrevious/>
            </Carousel>
        </div>
    );
}

export default PresetsControl;
