import create from 'zustand'

interface Canvas {
    paths: string[],
    erasing: boolean,
    drawing: boolean,
    points: [number, number][],
    strokeWidth: number,
    setDrawing: (isDrawing: boolean) => void,
    setErasing: (isErasing: boolean) => void,
    setPoints: (newPoints: [number, number][]) => void,
    setPaths: (newPaths: string[]) => void,
    setStrokeWidth: (newStroke: number) => void,

}

const useCanvasStore = create<Canvas>((set) => ({
    paths: [],
    drawing: false,
    erasing: false,
    points: [],
    strokeWidth: 1,
    setDrawing: (isDrawing: boolean) => set(() => ({ drawing: isDrawing })),
    setErasing: (isErasing: boolean) => set(() => ({ erasing: isErasing })),
    setPoints: (newPoints: [number, number][]) => set(state => ({
        points: newPoints
    })),
    setPaths: (newPaths: string[]) => set(state => ({
        paths: newPaths
    })),
    setStrokeWidth: (newStroke: number) => set(state => ({
        strokeWidth: newStroke
    })),
}))

export default useCanvasStore;