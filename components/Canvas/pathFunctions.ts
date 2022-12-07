var intersect = require('path-intersection');

type Point = { x: number, y: number };
type Intersection = Point;

export function isPointInPath(path1: string, path2: string): boolean {

    // Calcola le intersezioni tra il path e la linea
    let intersections: Intersection[] = intersect(path1, path2);

    // Restituisce true se ci sono intersezioni, false altrimenti
    return intersections.length > 0;
}
