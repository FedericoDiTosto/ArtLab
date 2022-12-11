import { MouseEvent, SetStateAction, Dispatch } from 'react';
import useCanvasStore from '../../../store/canvasStore';
import { interpolate } from '../../Canvas/functions/simplifyPath'

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
        const interpolatedPoints = interpolate(points);
        setPoints(interpolatedPoints);
        const currentPath =
            points.length === 0
                ? ""
                : `M${interpolatedPoints[0][0]},${interpolatedPoints[0][1]} C${interpolatedPoints[0][0]},${interpolatedPoints[0][1]}` +
                interpolatedPoints
                    .slice(1)
                    .map(
                        (point) =>
                            ` ${point[0]},${point[1]} ${point[0]},${point[1]}`
                    )
                    .join("");
        setCurrentPath(currentPath);
        setSavedPaths([...savedPaths, currentPath]);
        setPoints([]);
        setPathStrokeWidths(prev => prev.set(currentPath, strokeWidth));
        setCurrentPath('');
    }

    return { handleMouseDownDraw, handleMouseUpDraw, handleMouseMoveDraw };
}
