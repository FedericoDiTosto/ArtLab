import { Dispatch, SetStateAction, useEffect } from "react";
import useCanvasStore from "../../../store/canvasStore";
import { Mode } from "../../../store/ui";

export function useUpdatePoints(mode: Mode, setCurrentPath: Dispatch<SetStateAction<string>>) {
    const isDrawing = useCanvasStore((state) => state.drawing)
    const { points } = useCanvasStore((state) => ({
        points: state.points,
    }));

    useEffect(() => {
        if (mode === Mode.DRAW && isDrawing && points?.length > 0) {
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
    }, [points, mode, isDrawing]);

    return isDrawing;
}
