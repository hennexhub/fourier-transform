import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import {Point} from "@/model/model.ts";

interface PathStoreState {
    paths: Record<string, Point[]>
    addPath: (id: string, points: Point[]) => void
    deletePath: (id: string) => void
}

export const usePathStore = create<PathStoreState>()(
    persist(
        immer((set) => ({
            paths: {},
            addPath: (id, points) =>
                set((state) => {
                    state.paths[id] = points
                }),

            deletePath: (id) =>
                set((state) => {
                    delete state.paths[id]
                }),
        })),
        {
            name: 'path-store',
        }
    )
)
