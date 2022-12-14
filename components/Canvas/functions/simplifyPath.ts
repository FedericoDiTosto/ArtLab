export function interpolate(points: [number, number][]) {
    const avgDistance = points.reduce((acc, val, i, arr) => {
        if (i === 0) return acc;
        const prev = arr[i - 1];
        return acc + Math.sqrt((val[0] - prev[0]) ** 2 + (val[1] - prev[1]) ** 2);
    }, 0) / points.length;
    const interpolatedPoints = [points[0]];
    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const current = points[i];
        const distance = Math.sqrt((current[0] - prev[0]) ** 2 + (current[1] - prev[1]) ** 2);
        if (distance < avgDistance * 3) {
            interpolatedPoints.push(current);
        }
    }
    console.log(points.length, interpolatedPoints.length)
    return interpolatedPoints;
}