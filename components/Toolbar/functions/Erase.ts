import { MouseEvent, Dispatch, SetStateAction } from 'react';
import useCanvasStore from '../../../store/canvasStore';
import { pathIntersection } from '../../Canvas/functions/pathFunctions';

export function Erase() {
    const { savedPaths, setSavedPaths } = useCanvasStore((state) => ({
        savedPaths: state.paths,
        setSavedPaths: state.setPaths
    }));
    const isErasing = useCanvasStore((state) => state.erasing)
    const setIsErasing = useCanvasStore((state) => state.setErasing)
    const { erasePoints, setErasePoints } = useCanvasStore((state) => ({
        erasePoints: state.erasePoints,
        setErasePoints: state.setErasePoints,
    }));

    const handleMouseDownErase = (event: MouseEvent<SVGSVGElement>) => {
        setIsErasing(true)
    };

    const handleMouseMoveErase = (event: MouseEvent<SVGSVGElement>, currentErasePath: string) => {
        if (isErasing) {
            const svg = event.currentTarget;
            const point = svg.createSVGPoint();
            point.x = event.clientX;
            point.y = event.clientY;
            const transformedPoint = point.matrixTransform(svg.getScreenCTM()!.inverse());
            setErasePoints([...erasePoints, [transformedPoint.x, transformedPoint.y]]);
            savedPaths.forEach((elm) => {
                if (pathIntersection(currentErasePath, String(elm))) {
                    setSavedPaths(savedPaths.filter(path => path !== String(elm)))
                }
            })
        }
    };

    const handleMouseUpErase = (event: MouseEvent<SVGSVGElement>, setCurrentErasePath: Dispatch<SetStateAction<string>>) => {
        setCurrentErasePath('');
        setIsErasing(false);
        setErasePoints([])
    };

    return { handleMouseDownErase, handleMouseUpErase, handleMouseMoveErase };
}


