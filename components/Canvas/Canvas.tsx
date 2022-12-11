import { KeyboardEventHandler, useEffect, useRef, Dispatch, SetStateAction } from 'react';
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
import { useEraseUpdatePoints } from './hook/useEraseUpdatePoints';
import { useUpdatePoints } from './hook/useUpdatePoints';

export default function Canvas() {
    const svgRef = useRef<SVGSVGElement>(null);
    const [currentZoom, setZoom] = useState(1);

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

    const { handleMouseDownSelect, handleMouseUpSelect, handleMouseMoveSelect } = Select();
    const { handleMouseDownDraw, handleMouseUpDraw, handleMouseMoveDraw } = Draw();
    const { handleMouseDownErase, handleMouseUpErase, handleMouseMoveErase } = Erase();
    const { handleMouseDownShape, handleMouseUpShape, handleMouseMoveShape } = Shape();
    const { handleMouseMovePen, handleMouseClickPen, handleKeyClickPen } = Pen();
    const { handleMouseMoveLine, handleMouseClickLine } = Line();

    const [currentStrokeWidth, setCurrentStrokeWidth] = useState<number>();
    const [pathStrokeWidths, setPathStrokeWidths] = useState<Map<string, number>>(new Map())
    const [startShapePoint, setStartShapePoint] = useState<[number, number]>();

    const isDrawing = useUpdatePoints(mode, setCurrentPath)
    const isErasing = useEraseUpdatePoints(mode, setCurrentErasePath)

    const handleMouseDown = (event: MouseEvent<SVGSVGElement>) => {
        switch (mode) {
            case Mode.SELECT:
                return handleMouseDownSelect(event, setStartShapePoint)
            case Mode.DRAW:
                return handleMouseDownDraw(event, currentPath, setPathStrokeWidths)
            case Mode.ERASE:
                return handleMouseDownErase(event)
            case Mode.SHAPE:
                return handleMouseDownShape(event, setStartShapePoint, currentPath, setPathStrokeWidths)
        }
    };

    const handleMouseMove = (event: MouseEvent<SVGSVGElement>) => {
        switch (mode) {
            case Mode.SELECT:
                return handleMouseMoveSelect(event, svgRef.current, startShapePoint, setCurrentSelectPath)
            case Mode.DRAW:
                return handleMouseMoveDraw(event, setCurrentStrokeWidth)
            case Mode.ERASE:
                return handleMouseMoveErase(event, currentErasePath)
            case Mode.SHAPE:
                return handleMouseMoveShape(event, svgRef.current, startShapePoint, setCurrentPath, setCurrentStrokeWidth)
            case Mode.PEN:
                return handleMouseMovePen(event, setCurrentPath, setCurrentStrokeWidth)
            case Mode.LINE:
                return handleMouseMoveLine(event, setCurrentPath, setCurrentStrokeWidth)
        }
    };

    const handleMouseUp = (event: MouseEvent<SVGSVGElement>) => {
        switch (mode) {
            case Mode.SELECT:
                return handleMouseUpSelect(event, setStartShapePoint, currentSelectPath, setCurrentSelectPath)
            case Mode.DRAW:
                return handleMouseUpDraw(event, setCurrentPath, setPathStrokeWidths)
            case Mode.ERASE:
                return handleMouseUpErase(event, setCurrentErasePath)
            case Mode.SHAPE:
                return handleMouseUpShape(event, setStartShapePoint, currentPath, setCurrentPath, setPathStrokeWidths)
        }
    };

    const handleMouseClick = (event: MouseEvent<SVGSVGElement>,) => {
        switch (mode) {
            case Mode.PEN:
                return handleMouseClickPen(event, currentPath, setPathStrokeWidths)
            case Mode.LINE:
                return handleMouseClickLine(event, currentPath, setPathStrokeWidths)
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