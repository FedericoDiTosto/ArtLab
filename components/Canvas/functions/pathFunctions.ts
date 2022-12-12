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
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        for (const [x, y] of vertices) {
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        }
        const [px, py] = point;
        return px >= minX && px <= maxX && py >= minY && py <= maxY;
    } else {
        return false;
    }
}

function isRectangleInsideRectangle(innerRectangle: string, outerRectangle: string) {
    let innerVertices = getRectangleVertices(innerRectangle);
    let outerVertices = getRectangleVertices(outerRectangle);
    return innerVertices.every((vertex) => isPointInsideRectangle(vertex, outerVertices));
}

function extractCoordinates(path: string): [number, number] {
    let startIndex = path.search(/[Mm]/);
    let coordinates = path.substring(startIndex + 1).split(/[ ,]+/).map(Number);
    return [coordinates[0], coordinates[1]];
}

function getCircleCenter(circle: string): [number, number] {
    let [x, y] = extractCoordinates(circle);
    return [x, y];
}

function getCircleRadius(circle: string): number {
    let [x, y] = extractCoordinates(circle);
    let [cx, cy] = extractControlPointCoordinates(circle);
    let radius = Math.sqrt(Math.pow(cx - x, 2) + Math.pow(cy - y, 2));
    return radius;
}

function extractControlPointCoordinates(path: string): [number, number] {
    let startIndex = path.search(/[Cc]/);
    let coordinates = path.substring(startIndex + 1).split(/[ ,]+/).map(Number);
    return [coordinates[0], coordinates[1]];
}

function isPointInsideCircle(point: [number, number], center: [number, number], radius: number): boolean {
    let distance = Math.sqrt(Math.pow(point[0] - center[0], 2) + Math.pow(point[1] - center[1], 2));
    return distance <= radius;
}

function isCircleInRectangle(pathCircle: string, pathRectangle: string): boolean {
    let rectangleVertices = getRectangleVertices(pathRectangle);
    let center = getCircleCenter(pathCircle);
    let radius = getCircleRadius(pathCircle);
    if (!isPointInsideRectangle(center, rectangleVertices)) {
        return false;
    }
    if (rectangleVertices.some((vertex) => isPointInsideCircle(vertex, center, radius))) {
        return false;
    }
    return true;
}

function isSegmentInRectangle(pathSegment: string, pathRectangle: string) {
    let [segmentP1x, segmentP1y, segmentP2x, segmentP2y] = getFirstAndLastPoints(pathSegment)
    let rectagleVertices = getRectangleVertices(pathRectangle)
    //console.log(pathSegment, isPointInsideRectangle([segmentP1x, segmentP1y], rectagleVertices) && isPointInsideRectangle([segmentP2x, segmentP2y], rectagleVertices))
    return isPointInsideRectangle([segmentP1x, segmentP1y], rectagleVertices) && isPointInsideRectangle([segmentP2x, segmentP2y], rectagleVertices)
}

export function isPathInRectangle(path: string, pathRectangle: string): boolean {
    if (path.startsWith('M') && path.includes('h')) {
        return isRectangleInsideRectangle(path, pathRectangle);
    } else if (path.startsWith('M') && path.includes('m') && path.includes('a')) {
        return isCircleInRectangle(path, pathRectangle);
    }
    else {
        //console.log(path, isSegmentInRectangle(path, pathRectangle))
        return isSegmentInRectangle(path, pathRectangle);
    }
}