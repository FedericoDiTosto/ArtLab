var intersect = require('path-intersection');

type Point = { x: number, y: number };
type Intersection = Point;

export function pathIntersection(path1: string, path2: string): boolean {
    let intersections: Intersection[] = intersect(path1, path2);
    return intersections.length > 0;
}


function getFirstAndLastPoints(path: string): number[] {
    const points = path.split(" ");
    const firstX = parseInt(points[0].split(",")[0].replace("M", ""), 10);
    const firstY = parseInt(points[0].split(",")[1], 10);
    const lastX = parseInt(points[points.length - 1].split(",")[0], 10);
    const lastY = parseInt(points[points.length - 1].split(",")[1], 10);

    return [firstX, firstY, lastX, lastY];
}

function getRectangleVertices(path: string): [number, number][] {
    if (path) {
        const coordinates = path.split('M')[1].split(',');
        const x = parseInt(coordinates[0], 10);
        const y = parseInt(coordinates[1], 10);
        const dimensions = path.split('h')[1].split('v');
        const width = parseInt(dimensions[0], 10);
        const height = parseInt(dimensions[1], 10);
        return [[x, y], [x + width, y], [x + width, y + height], [x, y + height]];
    }
    return []
}

function isPointInsideRectangle(point: [number, number], vertices: [number, number][]): boolean {
    if (vertices.length >= 4) {
        const [x1, y1] = vertices[0];
        const [x2, y2] = vertices[1];
        const [x3, y3] = vertices[2];
        const [x4, y4] = vertices[3];
        const [px, py] = point;
        return px >= x1 && px <= x2 && py >= y1 && py <= y3;
    } else {
        return false;
    }
}

export function isSegmentInRectangle(pathSegment: string, pathRectangle: string) {
    let [segmentP1x, segmentP1y, segmentP2x, segmentP2y] = getFirstAndLastPoints(pathSegment)
    let rectagleVertices = getRectangleVertices(pathRectangle)
    return isPointInsideRectangle([segmentP1x, segmentP1y], rectagleVertices) && isPointInsideRectangle([segmentP2x, segmentP2y], rectagleVertices)
}