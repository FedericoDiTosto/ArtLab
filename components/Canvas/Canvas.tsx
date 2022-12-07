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
    const [currentPath, setCurrentPath] = useState<string>('');
    const [currentErasePath, setCurrentErasePath] = useState<string>('');
    const { shape, setShape } = useCanvasStore((state) => ({
        shape: state.shape,
        setShape: state.setShape
    }));

    const { savedPaths, setSavedPaths } = useCanvasStore((state) => ({
        savedPaths: state.paths,
        setSavedPaths: state.setPaths,
    }));
    const isDrawing = useCanvasStore((state) => state.drawing)
    const isErasing = useCanvasStore((state) => state.erasing)
    const isCreatingShape = useCanvasStore((state) => state.shape)
    const setIsDrawing = useCanvasStore((state) => state.setDrawing)
    const setIsErasing = useCanvasStore((state) => state.setErasing)
    const setIsCreatingShape = useCanvasStore((state) => state.setIsCreatingShape)
    const { points, setPoints } = useCanvasStore((state) => ({
        points: state.points,
        setPoints: state.setPoints,
    }));
    const { erasePoints, setErasePoints } = useCanvasStore((state) => ({
        erasePoints: state.erasePoints,
        setErasePoints: state.setErasePoints,
    }));
    const { strokeWidth } = useCanvasStore((state) => ({
        strokeWidth: state.strokeWidth,
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
        if (mode === Mode.DRAW) {
            setIsDrawing(true);
            setPathStrokeWidths(prev => prev.set(currentPath, strokeWidth));
        }
        else if (mode === Mode.ERASE) {
            setIsErasing(true)
        }
        else if (isCreatingShape && mode === Mode.SHAPE) {
            const target = event.target as Element;

            // Get the bounding rectangle of the canvas SVG element
            const svgRect = target.getBoundingClientRect();
            const x = event.clientX - svgRect.left;
            const y = event.clientY - svgRect.top;
            setStartShapePoint([x, y]);
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
            setErasePoints([...erasePoints, [transformedPoint.x, transformedPoint.y]]);
        }
        else if (isCreatingShape && mode === Mode.SHAPE && startShapePoint) {
            // Calcola la dimensione della forma utilizzando le coordinate del mouse
            // e il punto iniziale della forma
            const target = event.target as Element;

            // Get the bounding rectangle of the canvas SVG element
            const svgRect = target.getBoundingClientRect();
            const x = event.clientX - svgRect.left;
            const y = event.clientY - svgRect.top;

            const width = x - startShapePoint[0];
            const height = y - startShapePoint[1];

            // Usa la forma selezionata per determinare la stringa SVG da disegnare
            let svgPath = "";
            if (shape === "Rectangle") {
                svgPath = `M${startShapePoint[0]},${startShapePoint[1]} h${width} v${height} h${-width} Z`;
            } else if (shape === "Circle") {
                const radius = Math.max(Math.abs(width), Math.abs(height));
                svgPath = `M${startShapePoint[0]},${startShapePoint[1]} m${-radius},0 a${radius},${radius} 0 1,0 ${2 * radius},0 a${radius},${radius} 0 1,0 ${-2 * radius},0`;
            }

            // Aggiorna il percorso corrente con il nuovo percorso SVG
            setCurrentPath(svgPath);
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
            setErasePoints([])
            setCurrentErasePath('');
        }
        else if (mode === Mode.SHAPE) {
            setStartShapePoint(undefined);
            setSavedPaths([...savedPaths, currentPath])
            setCurrentPath('');
            setIsCreatingShape(false)
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