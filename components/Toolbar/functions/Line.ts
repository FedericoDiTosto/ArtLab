import { useState, MouseEvent, SetStateAction, Dispatch } from 'react';
import useCanvasStore from '../../../store/canvasStore';

export function Line() {
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

    const handleMouseClickLine = (event: MouseEvent<SVGSVGElement>, currentPath: string) => {
        setIsDrawing(true);
        const svg = event.currentTarget;
        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        const transformedPoint = point.matrixTransform(svg.getScreenCTM()!.inverse());
        setPoints([...points, [transformedPoint.x, transformedPoint.y]]);
        setSavedPaths([...savedPaths, currentPath]);
        if (points.length > 0) {
            setIsDrawing(false);
            setPoints([])
            return;
        }
        setIsDrawing(true);
    };

    const handleMouseMoveLine = (event: MouseEvent<SVGSVGElement>, setCurrentPath: Dispatch<SetStateAction<string>>) => {
        if (isDrawing) {
            // Update the current path with the new point
            const svg = event.currentTarget;
            const point = svg.createSVGPoint();
            point.x = event.clientX;
            point.y = event.clientY;
            const transformedPoint = point.matrixTransform(svg.getScreenCTM()!.inverse());
            const currentPath = `M${points[0][0]},${points[0][1]} C${points[0][0]},${points[0][1]} ${transformedPoint.x},${transformedPoint.y} ${transformedPoint.x},${transformedPoint.y}`;
            setCurrentPath(currentPath);
        }
    };


    return { handleMouseMoveLine, handleMouseClickLine };
}