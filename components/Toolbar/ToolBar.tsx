import { BiNavigation, BiPencil,BiEraser, BiPen,BiMinus,  BiCircle, BiSquare} from "react-icons/bi";
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
            <div className={styles.toolbarBody}>
            <div className={mode !== Mode.SELECT ? styles.toolbarButton : styles.toolbarButtonActive} onClick={() => changeMode(Mode.SELECT)} title="select">
                <BiNavigation className={styles.toolbarIcon} />
            </div>
            <div className={mode !== Mode.DRAW ? styles.toolbarButton : styles.toolbarButtonActive} onClick={() => changeMode(Mode.DRAW)} title="pencil">
                <BiPencil className={styles.toolbarIcon} />
            </div>
            <div className={mode !== Mode.ERASE ? styles.toolbarButton : styles.toolbarButtonActive} onClick={() => changeMode(Mode.ERASE)} title="eraser">
                <BiEraser className={styles.toolbarIcon} />
            </div>
            <div className={mode !== Mode.PEN ? styles.toolbarButton : styles.toolbarButtonActive} onClick={() => changeMode(Mode.PEN)} title="pen">
                <BiPen className={styles.toolbarIcon} />
            </div>
            <div className={mode !== Mode.LINE ? styles.toolbarButton : styles.toolbarButtonActive} onClick={() => changeMode(Mode.LINE)} title="line">
                <BiMinus className={styles.toolbarIcon} />
            </div>
            <div className={mode !== Mode.SHAPE || shape !== "Rectangle" ? styles.toolbarButton : styles.toolbarButtonActive} onClick={() => changeMode(Mode.SHAPE, "Rectangle")} title="rectangle">
                <BiSquare className={styles.toolbarIcon} />
            </div>
            <div className={mode !== Mode.SHAPE || shape !== "Circle" ? styles.toolbarButton : styles.toolbarButtonActive} onClick={() => changeMode(Mode.SHAPE, "Circle")} title="circle">
                <BiCircle className={styles.toolbarIcon} />
            </div>
            <div className={styles.boxSliderSrokeWidth} title="stroke">
                <input type="number" min="0.25" max="100" value={strokeWidth} onChange={onStrokeWidthChange} />
                <div className={styles.spanStrokeWidth}>px</div>
            </div>
        </div>
        </div>
    );
}