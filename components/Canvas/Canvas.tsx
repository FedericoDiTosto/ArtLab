import Head from 'next/head'
import Image from 'next/image'
import { createElement, MouseEventHandler, useRef } from 'react';
import styles from './Canvas.module.css'
import { useState, MouseEvent } from 'react';
import useCanvasStore from '../../store/store';
import useUiStore, { Mode } from "../../store/ui";



export default function Canvas() {
    const { mode } = useUiStore((state) => ({
        mode: state.mode,
    }));
    const { paths, setPaths } = useCanvasStore((state) => ({
        paths: state.paths,
        setPaths: state.setPaths,
    }));
    const isDrawing = useCanvasStore((state) => state.drawing)
    const setIsDrawing = useCanvasStore((state) => state.setDrawing)
    const { points, setPoints } = useCanvasStore((state) => ({
        points: state.points,
        setPoints: state.setPoints,
    }));

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

            const path =
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

            setPaths([...paths, path]);
            setPoints([]);
        } else if (mode === Mode.ERASE) {
            setPaths([]);
            setPoints([]);
        }
    };

    return (
        <svg
            className={styles.canvas}
            width="500px"
            height="300px"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {paths.map((path, index) => (
                <path
                    key={index}
                    d={path}
                    fill="none"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            ))}
        </svg>
    );
};

