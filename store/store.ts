import create from 'zustand'

interface Canvas {
    setDrawing: any;
    paths: string[],
    drawing: boolean,
    points: [number, number][],
    setPoints: (newPoints: [number, number][]) => void,
    setPaths: (newPaths: string[]) => void,

}

const useCanvasStore = create<Canvas>((set) => ({
    paths: [],
    drawing: false,
    points: [],
    setDrawing: (isDrawing: boolean) => set(() => ({ drawing: isDrawing })),
    setPoints: (newPoints: [number, number][]) => set(state => ({
        points: newPoints
    })),
    setPaths: (newPaths: string[]) => set(state => ({
        paths: newPaths
    }))
}))

export default useCanvasStore;