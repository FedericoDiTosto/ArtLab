import { Dispatch, SetStateAction, useEffect } from "react";
import useCanvasStore from "../../../store/canvasStore";
import { Mode } from "../../../store/ui";

export function useEraseUpdatePoints(mode: Mode, setCurrentErasePath: Dispatch<SetStateAction<string>>) {
    const { erasePoints } = useCanvasStore((state) => ({
        erasePoints: state.erasePoints,
    }));
    const isErasing = useCanvasStore((state) => state.erasing)

    useEffect(() => {
        if (mode === Mode.ERASE && isErasing && erasePoints.length > 0) {
            setCurrentErasePath("");
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
    }, [erasePoints, mode, isErasing]);

    return isErasing;
}