import { useState, MouseEvent, SetStateAction, Dispatch } from 'react';
import useCanvasStore from '../../../store/canvasStore';

export function Draw() {
    const { savedPaths, setSavedPaths } = useCanvasStore((state) => ({
        savedPaths: state.paths,
        setSavedPaths: state.setPaths,
    }));
    const isDrawing = useCanvasStore((state) => state.drawing)
    const setIsDrawing = useCanvasStore((state) => state.setDrawing)
    const { points, setPoints } = useCanvasStore((state) => ({
        points: state.points,
        setPoints: state.setPoints,
    }));
    const { strokeWidth } = useCanvasStore((state) => ({
        strokeWidth: state.strokeWidth,
    }));

    const handleMouseDownDraw = (event: MouseEvent<SVGSVGElement>, currentPath: string, setPathStrokeWidths: Dispatch<SetStateAction<Map<string, number>>>) => {
        setIsDrawing(true);
        setPathStrokeWidths(prev => prev.set(currentPath, strokeWidth));
    };

    const handleMouseMoveDraw = (event: MouseEvent<SVGSVGElement>, setCurrentStrokeWidth: Dispatch<SetStateAction<number | undefined>>) => {
        if (isDrawing) {
            const svg = event.currentTarget;
            const point = svg.createSVGPoint();
            point.x = event.clientX;
            point.y = event.clientY;
            const transformedPoint = point.matrixTransform(svg.getScreenCTM()!.inverse());
            setPoints([...points, [transformedPoint.x, transformedPoint.y]]);
            setCurrentStrokeWidth(strokeWidth);
        }
    }

    const handleMouseUpDraw = (event: MouseEvent<SVGSVGElement>, setCurrentPath: Dispatch<SetStateAction<string>>, setPathStrokeWidths: Dispatch<SetStateAction<Map<string, number>>>) => {
        setIsDrawing(false);
        const currentPath =
            points.length === 0
                ? ""
                : `M${points[0][0]},${points[0][1]} C${points[0][0]},${points[0][1]}` +
                points
                    .slice(1)
                    .map(
                        (point) =>
                            ` ${point[0]},${point[1]} ${point[0]},${point[1]}`
                    )
                    .join("");

        setSavedPaths([...savedPaths, currentPath]);
        setPoints([]);
        setPathStrokeWidths(prev => prev.set(currentPath, strokeWidth));
        setCurrentPath('');
    }

    return { handleMouseDownDraw, handleMouseUpDraw, handleMouseMoveDraw };
}
