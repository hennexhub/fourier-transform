import './App.css'
import {useCallback, useEffect, useRef, useState} from "react";
import {HeroUIProvider} from "@heroui/react";
import AnimationControl, {ShareableSettings} from "@/components/main/AnimationControl.tsx";
import Sidebar from "@/components/menu/properties/Sidebar.tsx";
import {useDisclosure} from "@heroui/modal";
import {Point} from "@/model/model.ts";
import {transformPathToDimensions} from "@/components/menu/csv.helper.ts";
import MouseTracker from "@/components/ui/MouseTracker.tsx";
import {v4 as uuidv4} from "uuid";
import {useIdStore} from "@/store/active-renderer.store.ts";
import {presets} from "@/presets.ts";
import {useRNGSettingsStore} from "@/store/rng_settings.store.ts";
import {useColorStrokeStore} from "@/store/color_stroke.store.ts";
import {usePathStore} from "@/store/path.store.ts";


export const useWindowSize = () => {
    const [size, setSize] = useState({width: window.innerWidth, height: window.innerHeight});

    useEffect(() => {
        const handleResize = () => setSize({width: window.innerWidth, height: window.innerHeight});
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return size;
};


function App() {
    const {width, height} = useWindowSize();
    const {isOpen, onOpenChange} = useDisclosure();
    const [isPause, setPause] = useState(false);
    const addRNGSettings = useRNGSettingsStore((state) => state.addRNGSettings)
    const addColorStrokeSettings = useColorStrokeStore((state) => state.addColorStrokeSettings)
    const addPath = usePathStore((state) => state.addPath)
    const paths = usePathStore((state) => state.paths)
    const addId = useIdStore(state => state.addId);
    const ids = useIdStore(state => state.ids);
    const setActiveId = useIdStore(state => state.setActiveId);
    const activeId = useIdStore(state => state.activeId);
    const idRef = useRef<boolean>(false);



    const onPauseButtonClick = useCallback(() => {
        setPause(prevState => !prevState);
        onOpenChange();
    }, [onOpenChange])

    // handle key event
    const handleKeyDown = useCallback((event: KeyboardEvent) => {

        if (event.code === 'Space') {
            event.preventDefault();
            if (!isOpen) {
                onOpenChange();
            }
            setPause(prevState => !prevState);
        }
    }, [isOpen, onOpenChange]);



    const decodeSettingsFromUrl = (): ShareableSettings | null => {
        const url = new URL(window.location.href);
        const base64 = url.searchParams.get("cfg");
        console.log(base64);
        if (!base64) return null;

        try {
            const json = atob(base64);
            return JSON.parse(json) as ShareableSettings;
        } catch (e) {
            console.warn("Failed to decode settings from URL:", e);
            return null;
        }
    };


    useEffect(() => {
        console.log('init');
        const id = uuidv4();
        const loaded = decodeSettingsFromUrl();
        if (loaded) {
            addId(id);
            setActiveId(id);
            addColorStrokeSettings(id, {colorSettings: loaded.color, strokeSettings: loaded.stroke});
            addRNGSettings(id, loaded.rng);
            idRef.current = true;
            return;
        }
        //wait for local storage items to be set from the stores.
        const timeOut = setTimeout(() => {
            if (!idRef.current) {
                idRef.current = true;
                addId(id);
                setActiveId(id);
                addColorStrokeSettings(id, {strokeSettings: presets[0].strokes, colorSettings: presets[0].colors});
                addRNGSettings(id, presets[0].rngSettings);
            }
        }, 50)
        return () => {
            clearTimeout(timeOut);
        };
    }, [addColorStrokeSettings, addId, addRNGSettings, setActiveId]);

    // key event listener
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);


    const adjustPathToViewPort = (id: string, path: Point[]) => {
        const transformedPath = transformPathToDimensions(path, width, height);
        if (transformedPath) {
            addPath(id, path);
        }
    };

    return (
        <>
            <HeroUIProvider>
                <>
                    {activeId && <Sidebar setPath={adjustPathToViewPort} isOpen={isOpen} onOpenChange={onOpenChange} id={activeId}/>}
                    {ids && ids.map((id, index) => (
                        <AnimationControl isPause={isPause} key={index} width={width} height={height} path={paths[id]}
                                          id={id}/>
                    ))}
                    <MouseTracker isPaused={isPause} onClick={onPauseButtonClick}/>
                </>
            </HeroUIProvider>
        </>
    );
}

export default App
