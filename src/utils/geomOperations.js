
export function rotatePolygon(polygon, deg) {
    const rad = Math.PI * (deg / 180);
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);
    return polygon.map((contour) => (
        contour.map(([x, y]) => [
             x * cos + y * sin,
            -x * sin + y * cos
        ])
    ));
}

export function rotateMultiPolygon(multipolygon, deg) {
    return multipolygon.map((poly) => rotatePolygon(poly, deg));
}

export function scalePolygon(polygon, factor) {
    const [factorX, factorY] = factor;
    return polygon.map((contour) => (
        contour.map(([x, y]) => [x * factorX, y * factorY])
    ));
}

export function scaleMultiPolygon(multipolygon, factor) {
    return multipolygon.map((poly) => scalePolygon(poly, factor));
}

export function movePolygon(polygon, shift) {
    const [shiftX, shiftY] = shift;
    return polygon.map((contour) => (
        contour.map(([x, y]) => [x + shiftX, y + shiftY])
    ));
}

export function moveMultiPolygon(multipolygon, shift) {
    return multipolygon.map((poly) => movePolygon(poly, shift));
}

export function mapPolygonPoints(polygon, func) {
    return polygon.map((contour) => contour.map(func));
}

export function mapMultiPolygonPoints(multipolygon, func) {
    return multipolygon.map((poly) => mapPolygonPoints(poly, func));
}
