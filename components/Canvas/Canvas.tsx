import { KeyboardEventHandler, useEffect, useRef } from 'react';
import styles from './Canvas.module.css'
import { useState, MouseEvent } from 'react';
import useCanvasStore from '../../store/canvasStore';
import useUiStore, { Mode } from "../../store/ui";
import { Draw } from '../Toolbar/functions/Draw';
import { Erase } from '../Toolbar/functions/Erase';
import { Shape } from '../Toolbar/functions/Shape';
import { Pen } from '../Toolbar/functions/Pen';
import { Line } from '../Toolbar/functions/Line';
import { Select } from '../Toolbar/functions/Select';


export default function Canvas() {
    const svgRef = useRef<SVGSVGElement>(null);
    const [currentZoom, setZoom] = useState(1);
    const { handleMouseDownSelect, handleMouseUpSelect, handleMouseMoveSelect } = Select();
    const { handleMouseDownDraw, handleMouseUpDraw, handleMouseMoveDraw } = Draw();
    const { handleMouseDownErase, handleMouseUpErase, handleMouseMoveErase } = Erase();
    const { handleMouseDownShape, handleMouseUpShape, handleMouseMoveShape } = Shape();
    const { handleMouseMovePen, handleMouseClickPen, handleKeyClickPen } = Pen();
    const { handleMouseMoveLine, handleMouseClickLine } = Line();
    const { mode } = useUiStore((state) => ({
        mode: state.mode,
    }));
    const [currentPath, setCurrentPath] = useState<string>('');
    const [currentErasePath, setCurrentErasePath] = useState<string>('');
    const [currentSelectPath, setCurrentSelectPath] = useState<string>('');
    const { savedPaths, selectedPaths } = useCanvasStore((state) => ({
        savedPaths: state.paths,
        selectedPaths: state.selectedPaths
    }));
    const isDrawing = useCanvasStore((state) => state.drawing)
    const isErasing = useCanvasStore((state) => state.erasing)
    const isSelecting = useCanvasStore((state) => state.selecting)
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
    }, [erasePoints]);

    const handleMouseDown = (event: MouseEvent<SVGSVGElement>) => {
        switch (mode) {
            case Mode.SELECT:
                handleMouseDownSelect(event, setStartShapePoint)
                break;
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
            case Mode.SELECT:
                handleMouseMoveSelect(event, svgRef.current, startShapePoint, setCurrentSelectPath)
                break;
            case Mode.DRAW:
                handleMouseMoveDraw(event, setCurrentStrokeWidth)
                break;
            case Mode.ERASE:
                handleMouseMoveErase(event, currentErasePath)
                break;
            case Mode.SHAPE:
                handleMouseMoveShape(event, svgRef.current, startShapePoint, setCurrentPath, setCurrentStrokeWidth)
                break;
            case Mode.PEN:
                handleMouseMovePen(event, setCurrentPath, setCurrentStrokeWidth)
                break;
            case Mode.LINE:
                handleMouseMoveLine(event, setCurrentPath, setCurrentStrokeWidth)
                break;
        }
    };

    const handleMouseUp = (event: MouseEvent<SVGSVGElement>,) => {
        switch (mode) {
            case Mode.SELECT:
                handleMouseUpSelect(event, setStartShapePoint, currentSelectPath, setCurrentSelectPath)
                break;
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

    const handleMouseClick = (event: MouseEvent<SVGSVGElement>,) => {
        switch (mode) {
            case Mode.PEN:
                handleMouseClickPen(event, currentPath, setPathStrokeWidths)
                break;
            case Mode.LINE:
                handleMouseClickLine(event, currentPath, setPathStrokeWidths)
                break;
        }
    };

    const handleKeyDown: KeyboardEventHandler = (event) => {
        if (event.ctrlKey && mode === Mode.PEN) {
            handleKeyClickPen(event, setCurrentPath);
        }
        if (event.ctrlKey && (event.key === '+' || event.key === '-')) {
            event.preventDefault();

            let newZoom = 1;
            if (event.key === '+') {
                newZoom = currentZoom + 0.5;
            } else if (event.key === '-') {
                newZoom = currentZoom - 0.5;
            }
            setZoom(newZoom);
        }
    };

    return (
        <svg
            ref={svgRef}
            tabIndex={0}
            className={styles.canvas}
            width={1200}
            height={700}
            transform={`scale(${currentZoom})`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleMouseClick}
            onKeyDown={handleKeyDown}
        >
            {savedPaths.filter((path) => !selectedPaths.includes(path)).map((path, index) => (
                < path
                    key={index}
                    d={path}
                    fill="none"
                    stroke="black"
                    strokeWidth={pathStrokeWidths.get(path)}
                    strokeLinecap="round"
                />
            ))}
            {selectedPaths.map((path, index) => (
                <>
                    <path
                        key={index}
                        d={path}
                        fill="none"
                        stroke="black"
                        strokeWidth={pathStrokeWidths.get(path)}
                        strokeLinecap="round"
                    />
                    < path
                        key={index}
                        d={path}
                        fill="none"
                        stroke="#00A2FF"
                        strokeWidth={1}
                        strokeLinecap="round"
                    />
                </>
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
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                />
            )}
            {currentSelectPath && (
                <path
                    d={currentSelectPath}
                    fill="#0082ce16"
                    stroke="#00A2FF"
                    strokeWidth="1"
                    strokeLinecap="round"
                />
            )}
        </svg>
    );
};