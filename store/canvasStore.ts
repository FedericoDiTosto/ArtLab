import create from 'zustand'

interface Canvas {
    paths: string[],
    selectedPaths: string[],
    erasing: boolean,
    drawing: boolean,
    selecting: boolean,
    creatingShape: boolean,
    points: [number, number][],
    erasePoints: [number, number][],
    strokeWidth: number,
    shape: string,
    setDrawing: (isDrawing: boolean) => void,
    setErasing: (isErasing: boolean) => void,
    setSelecting: (isErasing: boolean) => void,
    setIsCreatingShape: (setIsCreatingShape: boolean) => void,
    setPoints: (newPoints: [number, number][]) => void,
    setErasePoints: (newPoints: [number, number][]) => void,
    setPaths: (newPaths: string[]) => void,
    setSelectedPaths: (newPaths: string[]) => void,
    setStrokeWidth: (newStroke: number) => void,
    setShape: (newShape: string) => void,
}

const useCanvasStore = create<Canvas>((set) => ({
    paths: [],
    selectedPaths: [],
    drawing: false,
    erasing: false,
    selecting: false,
    creatingShape: false,
    points: [],
    erasePoints: [],
    strokeWidth: 1,
    shape: '',
    setDrawing: (isDrawing: boolean) => set(() => ({ drawing: isDrawing })),
    setErasing: (isErasing: boolean) => set(() => ({ erasing: isErasing })),
    setSelecting: (isSelecting: boolean) => set(() => ({ selecting: isSelecting })),
    setIsCreatingShape: (isCreatingSHape: boolean) => set(() => ({ creatingShape: isCreatingSHape })),
    setPoints: (newPoints: [number, number][]) => set(state => ({
        points: newPoints
    })),
    setErasePoints: (newPoints: [number, number][]) => set(state => ({
        erasePoints: newPoints
    })),
    setPaths: (newPaths: string[]) => set(state => ({
        paths: newPaths
    })),
    setSelectedPaths: (newPaths: string[]) => set(state => ({
        selectedPaths: newPaths
    })),
    setStrokeWidth: (newStroke: number) => set(state => ({
        strokeWidth: newStroke
    })),
    setShape: (newShape: string) => set(state => ({
        shape: newShape
    })),
}))

export default useCanvasStore;