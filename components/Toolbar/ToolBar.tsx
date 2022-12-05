import * as React from "react";
import { FaPencilAlt, FaEraser } from "react-icons/fa";
import { MdColorLens } from "react-icons/md";
import useUiStore, { Mode } from "../../store/ui";

import styles from "./Toolbar.module.css";

type Props = {
    onPencilClick: () => void;
    onEraserClick: () => void;
    onColorPickerClick: () => void;
};

export default function Toolbar(props: Props) {
    const { mode, setMode } = useUiStore((state) => ({
        mode: state.mode,
        setMode: state.setMode,
    }));

    const onPencilClick = () => {
        // Richiama la funzione setMode per impostare la modalità su DRAW
        setMode(Mode.DRAW);
    }
    return (
        <div className={styles.toolbar}>
            <button className={styles.toolbarButton} onClick={props.onPencilClick}>
                <FaPencilAlt className={styles.toolbarIcon} />
            </button>
            <button className={styles.toolbarButton} onClick={props.onEraserClick}>
                <FaEraser className={styles.toolbarIcon} />
            </button>
            <button className={styles.toolbarButton} onClick={props.onColorPickerClick}>
                <MdColorLens className={styles.toolbarIcon} />
            </button>
        </div>
    );
}