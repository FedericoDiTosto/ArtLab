import create from 'zustand'

export enum Mode {
    SELECT,
    DRAW,
    ERASE,
    PEN,
    SHAPE,
    LINE
}

interface Ui {
    mode: Mode,
    setMode: (mode: Mode) => void,
}

const useUiStore = create<Ui>((set) => ({
    mode: Mode.SELECT,
    setMode: (mode: Mode) => set(() => ({ mode: mode })),
}))

export default useUiStore;