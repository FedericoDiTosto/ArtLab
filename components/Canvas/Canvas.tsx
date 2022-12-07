import { useEffect } from 'react';
import styles from './Canvas.module.css'
import { useState, MouseEvent } from 'react';
import useCanvasStore from '../../store/canvasStore';
import useUiStore, { Mode } from "../../store/ui";
import { Draw } from '../Toolbar/functions/Draw';
import { Erase } from '../Toolbar/functions/Erase';
import { Shape } from '../Toolbar/functions/Shape';


export default function Canvas() {
    const { handleMouseDownDraw, handleMouseUpDraw, handleMouseMoveDraw } = Draw();
    const { handleMouseDownErase, handleMouseUpErase, handleMouseMoveErase } = Erase();
    const { handleMouseDownShape, handleMouseUpShape, handleMouseMoveShape } = Shape();
    const { mode } = useUiStore((state) => ({
        mode: state.mode,
    }));
    const [currentPath, setCurrentPath] = useState<string>('');
    const [currentErasePath, setCurrentErasePath] = useState<string>('');
    const { savedPaths } = useCanvasStore((state) => ({
        savedPaths: state.paths,
    }));
    const isDrawing = useCanvasStore((state) => state.drawing)
    const isErasing = useCanvasStore((state) => state.erasing)
    const isCreatingShape = useCanvasStore((state) => state.shape)
    const { points } = useCanvasStore((state) => ({
        points: state.points,
    }));
    const { erasePoints } = useCanvasStore((state) => ({
        erasePoints: state.erasePoints,
    }));
    const [currentStrokeWidth, setCurrentStrokeWidth] = useState<number>();
    const [pathStrokeWidths, setPathStrokeWidths] = useState<Map<string, number>>(new Map())
    const [startShapePoint, setStartShapePoint] = useState<[number, number]>();

    useEffect(() => {
        if (mode === Mode.DRAW && isDrawing && points.length > 0) {
            const currentPath = `M${points[0][0]},${points[0][1]} C${points[0][0]},${points[0][1]}` +
                points
                    .slice(1)
                    .map(
                        (point) =>
                            ` ${point[0]},${point[1]} ${point[0]},${point[1]}`
                    )
                    .join("");

            setCurrentPath(currentPath);
        }
    }, [points]);

    useEffect(() => {
        if (mode === Mode.ERASE && isErasing && erasePoints.length > 0) {
            setCurrentErasePath("");
            const currentPath = `M${erasePoints[0][0]},${erasePoints[0][1]} C${erasePoints[0][0]},${erasePoints[0][1]}` +
                erasePoints
                    .slice(1)
                    .map(
                        (point) =>
                            ` ${point[0]},${point[1]} ${point[0]},${point[1]}`
                    )
                    .join("");
            setCurrentErasePath(currentPath);
        }
    }), [erasePoints]

    const handleMouseDown = (event: MouseEvent<SVGSVGElement>) => {
        switch (mode) {
            case Mode.DRAW:
                handleMouseDownDraw(event, currentPath, setPathStrokeWidths)
                break;
            case Mode.ERASE:
                handleMouseDownErase(event)
                break;
            case Mode.SHAPE:
                handleMouseDownShape(event, setStartShapePoint, currentPath, setPathStrokeWidths)
                break;
        }
    };

    const handleMouseMove = (event: MouseEvent<SVGSVGElement>) => {
        switch (mode) {
            case Mode.DRAW:
                handleMouseMoveDraw(event, setCurrentStrokeWidth)
                break;
            case Mode.ERASE:
                handleMouseMoveErase(event, currentErasePath)
                break;
            case Mode.SHAPE:
                handleMouseMoveShape(event, startShapePoint, setCurrentPath, setCurrentStrokeWidth)
                break;
        }
    };

    const handleMouseUp = (event: MouseEvent<SVGSVGElement>,) => {
        switch (mode) {
            case Mode.DRAW:
                handleMouseUpDraw(event, setCurrentPath, setPathStrokeWidths)
                break;
            case Mode.ERASE:
                handleMouseUpErase(event, setCurrentErasePath)
                break;
            case Mode.SHAPE:
                handleMouseUpShape(event, setStartShapePoint, currentPath, setCurrentPath, setPathStrokeWidths)
                break;
        }
    };

    return (
        <svg
            className={styles.canvas}
            width={1200}
            height={700}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {savedPaths.map((path, index) => (
                <path
                    key={index}
                    d={path}
                    fill="none"
                    stroke="black"
                    strokeWidth={pathStrokeWidths.get(path)}
                    strokeLinecap="round"
                />
            ))}
            {currentPath && (
                <path
                    d={currentPath}
                    fill="none"
                    stroke="black"
                    strokeWidth={currentStrokeWidth}
                    strokeLinecap="round"
                />
            )}
            {isErasing && currentErasePath && (
                <path
                    d={currentErasePath}
                    fill="none"
                    stroke="black"
                    strokeWidth="1"
                    stroke-dasharray="4 4"
                    strokeLinecap="round"
                />
            )}
        </svg>
    );
};