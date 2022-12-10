import { MouseEvent, SetStateAction, Dispatch } from 'react';
import useCanvasStore from '../../../store/canvasStore';
import { isSegmentInRectangle, pathIntersection } from '../../Canvas/pathFunctions'

export function Select() {
    const { shape } = useCanvasStore((state) => ({
        shape: state.shape,
    }));

    const { savedPaths, selectedPaths, setSelectedPaths } = useCanvasStore((state) => ({
        savedPaths: state.paths,
        selectedPaths: state.selectedPaths,
        setSelectedPaths: state.setSelectedPaths,
    }));

    const handleMouseDownSelect = (event: MouseEvent<SVGSVGElement>, setStartShapePoint: Dispatch<SetStateAction<[number, number] | undefined>>) => {
        const target = event.target as Element;
        const svgRect = target.getBoundingClientRect();
        const x = event.clientX - svgRect.left;
        const y = event.clientY - svgRect.top;
        setStartShapePoint([x, y]);
    };

    const handleMouseMoveSelect = (event: MouseEvent<SVGSVGElement>, svgElement: SVGSVGElement | null, startShapePoint: [number, number] | undefined, setCurrentSelectPath: Dispatch<SetStateAction<string>>) => {
        const svgRect = svgElement?.getBoundingClientRect();
        if (startShapePoint && svgRect) {
            const x = event.clientX - svgRect.left;
            const y = event.clientY - svgRect.top;
            const width = x - startShapePoint[0];
            const height = y - startShapePoint[1];
            let svgPath = "";
            svgPath = `M${startShapePoint[0]},${startShapePoint[1]} h${width} v${height} h${-width} Z`;
            setCurrentSelectPath(svgPath)
        }
    };

    const handleMouseUpSelect = (event: MouseEvent<SVGSVGElement>, setStartShapePoint: Dispatch<SetStateAction<[number, number] | undefined>>, currentSelectPath: string, setCurrentSelectPath: Dispatch<SetStateAction<string>>) => {
        // Store the selected paths in the global state
        const selectedPaths = savedPaths.filter(path => pathIntersection(path, currentSelectPath) || isSegmentInRectangle(path, currentSelectPath));
        setSelectedPaths(selectedPaths);
        console.log(selectedPaths)
        setStartShapePoint(undefined);
        setCurrentSelectPath('');
    };
    return { handleMouseDownSelect, handleMouseUpSelect, handleMouseMoveSelect };
}
