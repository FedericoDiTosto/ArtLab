import Head from 'next/head'
import Image from 'next/image'
import { createElement, MouseEventHandler, useEffect, useRef } from 'react';
import styles from './Canvas.module.css'
import { useState, MouseEvent } from 'react';
import useCanvasStore from '../../store/store';
import useUiStore, { Mode } from "../../store/ui";

export default function Canvas() {
    const { mode } = useUiStore((state) => ({
        mode: state.mode,
    }));
    const [currentPath, setCurrentPath] = useState('');
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

    const handleMouseDown = (event: MouseEvent<SVGSVGElement>) => {
        if (mode === Mode.DRAW) {
            setIsDrawing(true);
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
        } else if (mode === Mode.ERASE) {
            setSavedPaths([]);
            setPoints([]);
            setCurrentPath('')
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
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            ))}
            {currentPath && (
                <path
                    d={currentPath}
                    fill="none"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            )}
        </svg>
    );
};

