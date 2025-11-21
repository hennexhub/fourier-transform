import {RNGCirclesSettings} from "@/model/model.ts";
import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'
import {persist} from 'zustand/middleware'
import {usePathStore} from "@/store/path.store.ts";


interface RNGSettingsState {
    rngSettingsMap: Record<string, RNGCirclesSettings>;
    addRNGSettings: (id: string, settings: RNGCirclesSettings) => void;
    activeSettings: RNGCirclesSettings | undefined;
    setActiveSettings: (id: string) => void;
    updateRNGSettings: (id: string, updated: Partial<RNGCirclesSettings>) => void;
    removeRNGSettings: (id: string) => void;
    setRNGSettingsMap: (map: Record<string, RNGCirclesSettings>) => void;
}

export const useRNGSettingsStore = create<RNGSettingsState>()(
    persist(
        immer((set, get) => ({
            rngSettingsMap: {},
            activeSettings: undefined,
            setActiveSettings: (id: string) => {
                const activeSettings = get().rngSettingsMap[id];
                set(state => {
                    if (activeSettings) {
                        state.activeSettings = activeSettings;
                    }
                })
            },
            addRNGSettings: (id, settings) => {
                console.log('set rngsettings', id);
                set(state => {
                    state.rngSettingsMap[id] = settings
                })
            },
            updateRNGSettings: (id, updatedSettings) => {
                usePathStore.getState().deletePath(id);
                    set(state => {
                        if (state.rngSettingsMap[id]) {
                            state.rngSettingsMap[id] = {
                                ...state.rngSettingsMap[id],
                                ...updatedSettings
                            }
                        }
                    })
            },
            removeRNGSettings: (id) => set(state => {
                delete state.rngSettingsMap[id]
            }),
            setRNGSettingsMap: (map) => set(state => {
                state.rngSettingsMap = map
            }),
        })),
        {name: 'rng-settings-store'}
    )
)
