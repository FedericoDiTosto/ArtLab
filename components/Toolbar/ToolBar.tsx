import { ChangeEvent, useState } from "react";
import { FaPencilAlt, FaEraser } from "react-icons/fa";
import { MdColorLens } from "react-icons/md";
import useCanvasStore from "../../store/canvasStore";
import useUiStore, { Mode } from "../../store/ui";

import styles from "./Toolbar.module.css";

export default function Toolbar() {
    const { mode, setMode } = useUiStore((state) => ({
        mode: state.mode,
        setMode: state.setMode,
    }));
    const { strokeWidth, setStrokeWidth } = useCanvasStore((state) => ({
        strokeWidth: state.strokeWidth,
        setStrokeWidth: state.setStrokeWidth
    }));

    const onPencilClick = () => {
        // Richiama la funzione setMode per impostare la modalità su DRAW
        setMode(Mode.DRAW);
    }
    const onEraserClick = () => {
        setMode(Mode.ERASE)
    }

    const onStrokeWidthChange = (event: any) => {
        setStrokeWidth(event.target.value);
    };

    return (
        <div className={styles.toolbar}>
            <button className={styles.toolbarButton} onClick={onPencilClick}>
                <FaPencilAlt className={styles.toolbarIcon} />
            </button>
            <button className={styles.toolbarButton} onClick={onEraserClick}>
                <FaEraser className={styles.toolbarIcon} />
            </button>
            <button className={styles.toolbarButton} >
                <MdColorLens className={styles.toolbarIcon} />
            </button>
            <input
                type="range"
                min="1"
                max="10"
                value={strokeWidth} // Aggiungi questa proprietà per collegare il valore dello strokeWidth al range
                onChange={onStrokeWidthChange} // Aggiungi questa proprietà per gestire il cambiamento del valore
            />
            {strokeWidth}
        </div>
    );
}