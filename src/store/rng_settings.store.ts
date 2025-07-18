import {RNGCirclesSettings} from "@/model/model.ts";
import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'
import {persist} from 'zustand/middleware'


type RNGSettingsMap = Record<string, RNGCirclesSettings>;

interface RNGSettingsState {
    rngSettingsMap: RNGSettingsMap;
    addRNGSettings: (id: string, settings: RNGCirclesSettings) => void;
    activeSettings: RNGSettingsMap | undefined;
    setActiveSettings: (id: string) => void;
    updateRNGSettings: (id: string, updated: Partial<RNGCirclesSettings>) => void;
    removeRNGSettings: (id: string) => void;
    setRNGSettingsMap: (map: RNGSettingsMap) => void;
}

export const useRNGSettingsStore = create<RNGSettingsState>()(
    persist(
        immer((set, get) => ({
            rngSettingsMap: {},
            activeSettings: undefined,
            setActiveSettings: (id: string) => {
                const activeSettings = get().rngSettingsMap[id];
                set(state => {
                    state.activeSettings = activeSettings;
                })
            },
            addRNGSettings: (id, settings) => set(state => {
                state.rngSettingsMap[id] = settings
            }),
            updateRNGSettings: (id, updatedSettings) =>
                set(state => {
                    if (state.rngSettingsMap[id]) {
                        state.rngSettingsMap[id].rngSettings = {
                            ...state.rngSettingsMap[id].rngSettings,
                            ...updatedSettings
                        }
                    }
                }),
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
