import { MouseEvent, SetStateAction, Dispatch } from 'react';
import useCanvasStore from '../../../store/canvasStore';

export function Shape() {
    const { shape } = useCanvasStore((state) => ({
        shape: state.shape,
    }));

    const { savedPaths, setSavedPaths } = useCanvasStore((state) => ({
        savedPaths: state.paths,
        setSavedPaths: state.setPaths,
    }));
    const isCreatingShape = useCanvasStore((state) => state.shape)
    const setIsCreatingShape = useCanvasStore((state) => state.setIsCreatingShape)
    const { strokeWidth } = useCanvasStore((state) => ({
        strokeWidth: state.strokeWidth,
    }));

    const handleMouseDownShape = (event: MouseEvent<SVGSVGElement>, setStartShapePoint: Dispatch<SetStateAction<[number, number] | undefined>>, currentPath: string, setPathStrokeWidths: Dispatch<SetStateAction<Map<string, number>>>) => {
        if (isCreatingShape) {
            const target = event.target as Element;
            const svgRect = target.getBoundingClientRect();
            const x = event.clientX - svgRect.left;
            const y = event.clientY - svgRect.top;
            setStartShapePoint([x, y]);
            setPathStrokeWidths(prev => prev.set(currentPath, strokeWidth));
        }
    };

    const handleMouseMoveShape = (event: MouseEvent<SVGSVGElement>, svgElement: SVGSVGElement | null, startShapePoint: [number, number] | undefined, setCurrentPath: Dispatch<SetStateAction<string>>, setCurrentStrokeWidth: Dispatch<SetStateAction<number | undefined>>) => {
        const svgRect = svgElement?.getBoundingClientRect();
        if (isCreatingShape && startShapePoint && svgRect) {
            const x = event.clientX - svgRect.left;
            const y = event.clientY - svgRect.top;
            const width = x - startShapePoint[0];
            const height = y - startShapePoint[1];
            let svgPath = "";
            if (shape === "Rectangle") {
                svgPath = `M${startShapePoint[0]},${startShapePoint[1]} h${width} v${height} h${-width} Z`;
            } else if (shape === "Circle") {
                const radius = Math.max(Math.abs(width), Math.abs(height));
                svgPath = `M${startShapePoint[0]},${startShapePoint[1]} m${-radius},0 a${radius},${radius} 0 1,0 ${2 * radius},0 a${radius},${radius} 0 1,0 ${-2 * radius},0`;
            }
            setCurrentPath(svgPath);
            setCurrentStrokeWidth(strokeWidth);
        }
    };

    const handleMouseUpShape = (event: MouseEvent<SVGSVGElement>, setStartShapePoint: Dispatch<SetStateAction<[number, number] | undefined>>, currentPath: string, setCurrentPath: Dispatch<SetStateAction<string>>, setPathStrokeWidths: Dispatch<SetStateAction<Map<string, number>>>) => {
        setStartShapePoint(undefined);
        setSavedPaths([...savedPaths, currentPath])
        setCurrentPath('');
        setIsCreatingShape(false)
        setPathStrokeWidths(prev => prev.set(currentPath, strokeWidth));
    };
    return { handleMouseDownShape, handleMouseUpShape, handleMouseMoveShape };
}


