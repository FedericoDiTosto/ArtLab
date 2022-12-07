import Head from 'next/head'
import Image from 'next/image'
import { createElement, MouseEventHandler, useEffect, useRef } from 'react';
import styles from './Canvas.module.css'
import { useState, MouseEvent } from 'react';
import useCanvasStore from '../../store/canvasStore';
import useUiStore, { Mode } from "../../store/ui";
import { isPointInPath } from './pathFunctions';
import path from 'path';


export default function Canvas() {
    const { mode } = useUiStore((state) => ({
        mode: state.mode,
    }));
    const [currentPath, setCurrentPath] = useState('');
    const [currentErasePath, setCurrentErasePath] = useState('');
    const { savedPaths, setSavedPaths } = useCanvasStore((state) => ({
        savedPaths: state.paths,
        setSavedPaths: state.setPaths,
    }));
    const isDrawing = useCanvasStore((state) => state.drawing)
    const isErasing = useCanvasStore((state) => state.erasing)
    const setIsDrawing = useCanvasStore((state) => state.setDrawing)
    const setIsErasing = useCanvasStore((state) => state.setErasing)
    const { points, setPoints } = useCanvasStore((state) => ({
        points: state.points,
        setPoints: state.setPoints,
    }));
    const { strokeWidth } = useCanvasStore((state) => ({
        strokeWidth: state.strokeWidth,
    }));
    const [currentStrokeWidth, setCurrentStrokeWidth] = useState<number>();
    const [pathStrokeWidths, setPathStrokeWidths] = useState<Map<string, number>>(new Map())

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
        if (mode === Mode.ERASE && isErasing && points.length > 0) {
            const currentPath = `M${points[0][0]},${points[0][1]} C${points[0][0]},${points[0][1]}` +
                points
                    .slice(1)
                    .map(
                        (point) =>
                            ` ${point[0]},${point[1]} ${point[0]},${point[1]}`
                    )
                    .join("");

            setCurrentErasePath(currentPath);
        }
    }, [points]);

    const handleMouseDown = (event: MouseEvent<SVGSVGElement>) => {
        if (mode === Mode.DRAW) {
            setIsDrawing(true);
            setPathStrokeWidths(prev => prev.set(currentPath, strokeWidth));
        }
        else if (mode === Mode.ERASE) {
            setIsErasing(true)
        }
    };

    const handleMouseMove = (event: MouseEvent<SVGSVGElement>) => {
        if (mode === Mode.DRAW && isDrawing) {
            const svg = event.currentTarget;
            const point = svg.createSVGPoint();
            point.x = event.clientX;
            point.y = event.clientY;
            const transformedPoint = point.matrixTransform(svg.getScreenCTM()!.inverse());
            setPoints([...points, [transformedPoint.x, transformedPoint.y]]);
            setCurrentStrokeWidth(strokeWidth);
        }
        else if (mode === Mode.ERASE && isErasing) {
            const svg = event.currentTarget;
            const point = svg.createSVGPoint();
            point.x = event.clientX;
            point.y = event.clientY;
            const transformedPoint = point.matrixTransform(svg.getScreenCTM()!.inverse());
            setPoints([...points, [transformedPoint.x, transformedPoint.y]]);
        }
    };

    const handleMouseUp = (event: MouseEvent<SVGSVGElement>) => {
        if (mode === Mode.DRAW) {
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
        if (mode === Mode.ERASE) {
            setIsErasing(false);
            const svg = event.currentTarget;
            const pathElements = svg.querySelectorAll('path');
            const paths = Array.from(pathElements).map(el => el.getAttribute('d'));
            paths.forEach((elm) => {
                if (isPointInPath(currentErasePath, String(elm))) {
                    var index = savedPaths.indexOf(String(elm));
                    if (index !== -1) {
                        savedPaths.splice(index, 1);
                    }
                }
            })
            setCurrentErasePath('');
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
        </svg>
    );
};