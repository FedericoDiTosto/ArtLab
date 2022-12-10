import { FaPencilAlt, FaEraser, FaPenNib, FaRegSquare, FaSlash, FaRegCircle, FaLocationArrow } from "react-icons/fa";
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
    const { shape, setShape } = useCanvasStore((state) => ({
        shape: state.shape,
        setShape: state.setShape
    }));

    const changeMode = (newMode: Mode, shapeType?: string) => {
        setMode(newMode)
        if (shapeType) {
            setShape(shapeType);
        }
    }

    const onStrokeWidthChange = (event: any) => {
        setStrokeWidth(event.target.value);
    };


    return (
        <div className={styles.toolbar}>
            <button className={styles.toolbarButton} onClick={() => changeMode(Mode.SELECT)} title="select">
                <FaLocationArrow className={styles.toolbarIcon} />
                {mode == Mode.SELECT ? <h4>&nbsp;select</h4> : null}
            </button>
            <button className={styles.toolbarButton} onClick={() => changeMode(Mode.DRAW)} title="pencil">
                <FaPencilAlt className={styles.toolbarIcon} />
                {mode == Mode.DRAW ? <h4>&nbsp;draw</h4> : null}
            </button>
            <button className={styles.toolbarButton} onClick={() => changeMode(Mode.ERASE)} title="eraser">
                <FaEraser className={styles.toolbarIcon} />
                {mode == Mode.ERASE ? <h4>&nbsp;erase</h4> : null}
            </button>
            <button className={styles.toolbarButton} onClick={() => changeMode(Mode.PEN)} title="pen">
                <FaPenNib className={styles.toolbarIcon} />
                {mode == Mode.PEN ? <h4>&nbsp;pen</h4> : null}
            </button>
            <button className={styles.toolbarButton} onClick={() => changeMode(Mode.LINE)} title="line">
                <FaSlash className={styles.toolbarIcon} />
                {mode == Mode.LINE ? <h4>&nbsp;line</h4> : null}
            </button>
            <button className={styles.toolbarButton} onClick={() => changeMode(Mode.SHAPE, "Rectangle")} title="rectangle">
                <FaRegSquare className={styles.toolbarIcon} />
                {mode == Mode.SHAPE && shape == "Rectangle" ? <h4>&nbsp;rectangle</h4> : null}
            </button>
            <button className={styles.toolbarButton} onClick={() => changeMode(Mode.SHAPE, "Circle")} title="circle">
                <FaRegCircle className={styles.toolbarIcon} />
                {mode == Mode.SHAPE && shape == "Circle" ? <h4>&nbsp;circle</h4> : null}
            </button>
            <div className={styles.boxSliderSrokeWidth} title="stroke">
                <input
                    className={styles.sliderSrokeWidth}
                    type="range"
                    min="1"
                    max="20"
                    value={strokeWidth}
                    onChange={onStrokeWidthChange}
                />
                <div className={styles.spanStrokeWidth}>{strokeWidth}</div>
            </div>

        </div>
    );
}