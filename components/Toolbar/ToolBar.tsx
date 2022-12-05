import { useState } from "react";
import { FaPencilAlt, FaEraser } from "react-icons/fa";
import { MdColorLens } from "react-icons/md";
import useUiStore, { Mode } from "../../store/ui";

import styles from "./Toolbar.module.css";

export default function Toolbar() {
    const { mode, setMode } = useUiStore((state) => ({
        mode: state.mode,
        setMode: state.setMode,
    }));

    const onPencilClick = () => {
        // Richiama la funzione setMode per impostare la modalità su DRAW
        setMode(Mode.DRAW);
    }
    const onEraserClick = () => {
        setMode(Mode.ERASE)
    }
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
        </div>
    );
}