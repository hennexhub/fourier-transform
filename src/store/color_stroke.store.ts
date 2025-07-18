import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'

import { ColorSettings, StrokeSettings } from '@/model/model'

export interface ColorAndStrokeSettings {
    colorSettings: ColorSettings;
    strokeSettings: StrokeSettings;
}
type ColorAndStrokeSettingsMap = Record<string, ColorAndStrokeSettings>

interface ColorAndStrokeSettingsState {
    settingsMap: ColorAndStrokeSettingsMap
    activeSettings: ColorAndStrokeSettings | undefined,
    setActiveSettings: (id: string) => void
    addColorStrokeSettings: (id: string, settings: ColorAndStrokeSettings) => void
    updateColorSettings: (id: string, changes: Partial<ColorSettings>) => void
    updateStrokeSettings: (id: string, changes: Partial<StrokeSettings>) => void
    removeSettings: (id: string) => void
    setSettingsMap: (map: ColorAndStrokeSettingsMap) => void
}

export const useColorStrokeStore = create<ColorAndStrokeSettingsState>()(
    persist(
        immer((set, get) => ({
            settingsMap: {},
            activeSettings: undefined,
            addColorStrokeSettings: (id, settings) =>
                set(state => { state.settingsMap[id] = settings }),
            setActiveSettings: (id: string) => {
                const activeSettings = get().settingsMap[id];
                set(state => {
                    state.activeSettings = activeSettings;
                })
            },
            updateColorSettings: (id, changes) =>
                set(state => {
                    if (state.settingsMap[id]) {
                        state.settingsMap[id].colorSettings = {
                            ...state.settingsMap[id].colorSettings,
                            ...changes,
                        }
                    }
                }),

            updateStrokeSettings: (id, changes) =>
                set(state => {
                    if (state.settingsMap[id]) {
                        state.settingsMap[id].strokeSettings = {
                            ...state.settingsMap[id].strokeSettings,
                            ...changes,
                        }
                    }
                }),
            removeSettings: (id) =>
                set(state => { delete state.settingsMap[id] }),

            setSettingsMap: (map) =>
                set(state => { state.settingsMap = map }),
        })),
        {
            name: 'color-and-stroke-settings-store',
        }
    )
)
