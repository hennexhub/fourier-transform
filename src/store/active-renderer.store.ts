import {create} from 'zustand'
import {persist} from 'zustand/middleware'

interface IdStoreState {
    ids: string[]
    activeId: string | null
    addId: (id: string) => void
    removeId: (id: string) => void
    setActiveId: (id: string) => void
    clearAll: () => void
}

export const useIdStore = create<IdStoreState>()(
    persist(
        (set) => ({
            ids: [],
            activeId: null,
            addId: (id) =>
                set((state) => ({
                    ids: state.ids.includes(id) ? state.ids : [...state.ids, id],
                })),

            removeId: (id) =>
                set((state) => ({
                    ids: state.ids.filter((i) => i !== id),
                    activeId: state.activeId === id ? null : state.activeId,
                })),

            setActiveId: (id) =>
                set((state) => ({
                    activeId: state.ids.includes(id) ? id : state.activeId,
                })),

            clearAll: () => set({ids: [], activeId: null}),
        }),
        {
            name: 'id-store',
        }
    )
)
