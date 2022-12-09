import { useState, MouseEvent, SetStateAction, Dispatch, KeyboardEventHandler } from 'react';
import useCanvasStore from '../../../store/canvasStore';
import useUiStore, { Mode } from '../../../store/ui';

export function Pen() {
    const { mode } = useUiStore((state) => ({
        mode: state.mode,
    }));
    const { points, setPoints } = useCanvasStore((state) => ({
        points: state.points,
        setPoints: state.setPoints,
    }));
    const isDrawing = useCanvasStore((state) => state.drawing)
    const setIsDrawing = useCanvasStore((state) => state.setDrawing)
    const { strokeWidth } = useCanvasStore((state) => ({
        strokeWidth: state.strokeWidth,
    }));
    const { savedPaths, setSavedPaths } = useCanvasStore((state) => ({
        savedPaths: state.paths,
        setSavedPaths: state.setPaths,
    }));

    const handleMouseClickPen = (event: MouseEvent<SVGSVGElement>, currentPath: string, setPathStrokeWidths: Dispatch<SetStateAction<Map<string, number>>>) => {
        setIsDrawing(true);
        const svg = event.currentTarget;
        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        const transformedPoint = point.matrixTransform(svg.getScreenCTM()!.inverse());
        setPoints([...points, [transformedPoint.x, transformedPoint.y]]);
        setSavedPaths([...savedPaths, currentPath]);
        setPathStrokeWidths(prev => prev.set(currentPath, strokeWidth));
    };

    const handleMouseMovePen = (event: MouseEvent<SVGSVGElement>, setCurrentPath: Dispatch<SetStateAction<string>>, setCurrentStrokeWidth: Dispatch<SetStateAction<number | undefined>>) => {
        if (isDrawing) {
            const svg = event.currentTarget;
            const point = svg.createSVGPoint();
            point.x = event.clientX;
            point.y = event.clientY;
            const transformedPoint = point.matrixTransform(svg.getScreenCTM()!.inverse());
            const currentPath = `M${points[points.length - 1][0]},${points[points.length - 1][1]} C${points[points.length - 1][0]},${points[points.length - 1][1]} ${transformedPoint.x},${transformedPoint.y} ${transformedPoint.x},${transformedPoint.y}`;
            setCurrentStrokeWidth(strokeWidth);
            setCurrentPath(currentPath);
        }
    };

    const handleKeyClickPen = (event: any, setCurrentPath: Dispatch<SetStateAction<string>>) => {
        if (isDrawing && event.ctrlKey && mode == Mode.PEN) {
            setCurrentPath("")
            setSavedPaths([...savedPaths]);
            setIsDrawing(false);
            setPoints([])
            return;
        }
    };


    return { handleMouseMovePen, handleMouseClickPen, handleKeyClickPen };
}