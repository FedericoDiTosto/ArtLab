var intersect = require('path-intersection');

type Point = { x: number, y: number };
type Intersection = Point;

export function isPointInPath(path1: string, path2: string): boolean {
    let intersections: Intersection[] = intersect(path1, path2);
    return intersections.length > 0;
}
