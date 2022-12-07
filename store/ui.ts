import create from 'zustand'

export enum Mode {
    DRAW,
    ERASE,
    PEN,
    SHAPE,
}

interface Ui {
    mode: Mode,
    setMode: (mode: Mode) => void,
}

const useUiStore = create<Ui>((set) => ({
    mode: Mode.DRAW,
    setMode: (mode: Mode) => set(() => ({ mode: mode })),
}))

export default useUiStore;