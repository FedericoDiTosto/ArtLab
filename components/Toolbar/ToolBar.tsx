import { ChangeEvent, useState } from "react";
import { FaPencilAlt, FaEraser, FaPenFancy } from "react-icons/fa";
import { MdColorLens } from "react-icons/md";
import useCanvasStore from "../../store/canvasStore";
import useUiStore, { Mode } from "../../store/ui";

import styles from "./Toolbar.module.css";

export default function Toolbar() {
    const { mode, setMode } = useUiStore((state) => ({
        mode: state.mode,
        setMode: state.setMode,
    }));
    const { savedPaths, setSavedPaths } = useCanvasStore((state) => ({
        savedPaths: state.paths,
        setSavedPaths: state.setPaths,
    }));
    const { strokeWidth, setStrokeWidth } = useCanvasStore((state) => ({
        strokeWidth: state.strokeWidth,
        setStrokeWidth: state.setStrokeWidth
    }));
    const { shape, setShape } = useCanvasStore((state) => ({
        shape: state.shape,
        setShape: state.setShape
    }));

    const onPencilClick = () => {
        // Richiama la funzione setMode per impostare la modalità su DRAW
        setMode(Mode.DRAW);
    }
    const onEraserClick = () => {
        setMode(Mode.ERASE)
    }

    const onPenClick = () => {
        setMode(Mode.PEN)
        console.log(savedPaths.length, savedPaths)
    }

    const onShapeClick = () => {
        setMode(Mode.SHAPE)
    }


    const onStrokeWidthChange = (event: any) => {
        setStrokeWidth(event.target.value);
    };

    const onShapeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setShape(event.target.value);
    };

    return (
        <div className={styles.toolbar}>
            <button className={styles.toolbarButton} onClick={onPencilClick} title="pencil">
                <FaPencilAlt className={styles.toolbarIcon} />
            </button>
            <button className={styles.toolbarButton} onClick={onEraserClick} title="eraser">
                <FaEraser className={styles.toolbarIcon} />
            </button>
            <button className={styles.toolbarButton} onClick={onPenClick}>
                <FaPenFancy className={styles.toolbarIcon} />
            </button>
            <div className={styles.boxSliderSrokeWidth} title="stroke">
                <input
                    className={styles.sliderSrokeWidth}
                    type="range"
                    min="1"
                    max="20"
                    value={strokeWidth} // Aggiungi questa proprietà per collegare il valore dello strokeWidth al range
                    onChange={onStrokeWidthChange} // Aggiungi questa proprietà per gestire il cambiamento del valore
                />
                <div className={styles.spanStrokeWidth}>{strokeWidth}</div>
            </div>
            <button className={styles.toolbarButton} onClick={onShapeClick}>
                <select value={shape} onChange={onShapeChange}>
                    <option value="Rectangle">Rectangle</option>
                    <option value="Circle">Circle</option>
                </select>
            </button>
        </div>
    );
}