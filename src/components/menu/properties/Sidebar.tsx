import {Drawer, DrawerContent, DrawerFooter, Tab, Tabs} from "@heroui/react";
import {Key, useState} from "react";
import StrokeControl from "@/components/menu/properties/control/StrokeControl.tsx";
import ColorControl from "@/components/menu/properties/control/ColorControl.tsx";
import RNGControl from "@/components/menu/properties/control/RNGControl.tsx";
import PresetsControl from "@/components/menu/properties/control/PresetsControl.tsx";
import {SvgMenu} from "@/components/menu/svg/SvgMenu.tsx";
import {Point} from "@/model/model.ts";
import CSVUpload from "@/components/menu/properties/control/components/CSVUpload.tsx";
import DrawPath from "@/components/menu/properties/control/components/DrawPath.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ShareableSettings} from "@/components/main/AnimationControl.tsx";
import {useRNGSettingsStore} from "@/store/rng_settings.store.ts";
import {useColorStrokeStore} from "@/store/color_stroke.store.ts";
import {ShareURLDialog} from "@/components/menu/properties/control/components/ShareURLDialog.tsx";

interface DrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    setPath: (id: string, path: Point[]) => void;
    id: string;
}
const encodeSettingsToUrl = (settings: ShareableSettings): string => {
    const json = JSON.stringify(settings);
    const base64 = btoa(json);
    const url = new URL(window.location.href);
    url.searchParams.set("cfg", base64);
    return url.toString();
};


export default function Sidebar({isOpen, onOpenChange, setPath, id}: DrawerProps) {

    const [selectedSetting, setSelectedSetting] = useState("presets");
    const [selected, setSelected] = useState("presets");
    const [open, setOpen] = useState(false);

    const currentRNGSettings = useRNGSettingsStore((state) => state.rngSettingsMap[id])
    const {colorSettings, strokeSettings} = useColorStrokeStore((state) => state.settingsMap[id]);
    const [encodedSettingsUrl, setEncodedSettingsUrl] = useState(encodeSettingsToUrl({rng: currentRNGSettings, color: colorSettings, stroke: strokeSettings}));

    const addPathWithCurrentId = (path: Point[]) => {
        if (id) {
            setPath(id, path);
        }
    }

    const onExportSettingsButtonClick = () => {
        const url = encodeSettingsToUrl({rng: currentRNGSettings, color: colorSettings, stroke: strokeSettings});
        setEncodedSettingsUrl(url);
        setOpen(true);
    }

    const selectionChange = (key: Key) => {
      setSelectedSetting(key.toString())
    }

    const onSVGTabChange = (key: Key) => {
        setSelected(key.toString())
    }
    if (!id) return null;

    return (
        <>
            <Drawer className={'z-20'} autoFocus={false} isDismissable={false} hideCloseButton isOpen={isOpen}
                    onOpenChange={onOpenChange} placement={'left'} size={'xs'} backdrop={'transparent'}>
                <DrawerContent className={'z-20'}>
                    <>
                        <div className={'w-full h-1/2 p-6 flex flex-col items-center '}>
                            <Tabs variant={'underlined'} size={'md'} selectedKey={selectedSetting}
                                  onSelectionChange={selectionChange} aria-label="Options">
                                <Tab className={'w-full'} key="stroke" title="Strokes ">
                                    <StrokeControl id={id}/>
                                </Tab>
                                <Tab className={'w-full'} key="color" title="Color ">
                                    <ColorControl id={id}/>
                                </Tab>
                                <Tab className={'w-full'} key="rng" title="RNG">
                                    <RNGControl id={id}/>
                                </Tab>
                                <Tab className={'w-full'} key="presets" title="Presets">
                                    <PresetsControl id={id}/>
                                </Tab>
                            </Tabs>
                        </div>
                        <div className={'w-full p-6 flex flex-col items-center '}>
                            <Button onClick={onExportSettingsButtonClick}>Export Settings</Button>
                        </div>
                        <div className={'w-full h-1/2 p-6 flex flex-col items-center '}>
                            <Tabs variant={'underlined'} size={'md'} selectedKey={selected}
                                  onSelectionChange={onSVGTabChange} aria-label="Options">
                                <Tab className={'w-full'} key="stroke" title="Upload ">
                                    <CSVUpload setPath={addPathWithCurrentId}/>
                                </Tab>
                                <Tab className={'w-full'} key="draw" title="Draw">
                                    <DrawPath setPath={addPathWithCurrentId}/>
                                </Tab>
                                <Tab className={'w-full'} key="presets" title="Pictures">
                                    <SvgMenu id={id} setPath={addPathWithCurrentId}/>
                                </Tab>

                            </Tabs>

                        </div>
                    </>
                </DrawerContent>
                <DrawerFooter>
                    <span className={'text-gray-600 text-xs'}>v1.0.0</span>
                </DrawerFooter>
            </Drawer>
            <ShareURLDialog
                open={open}
                onOpenChange={setOpen}
                url={encodedSettingsUrl}
            />
        </>
    );
}
