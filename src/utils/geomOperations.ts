import { MultiPolygon, Polygon, Point, Contour } from "../types";

export function rotatePolygon(polygon: Polygon, deg: number): Polygon {
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

export function rotateMultiPolygon(multipolygon: MultiPolygon, deg: number): MultiPolygon {
    return multipolygon.map((poly) => rotatePolygon(poly, deg));
}

export function scalePolygon(polygon: Polygon, factor: Point): Polygon {
    const [factorX, factorY] = factor;
    return polygon.map((contour) => (
        contour.map(([x, y]) => [x * factorX, y * factorY])
    ));
}

export function scaleMultiPolygon(multipolygon: MultiPolygon, factor: Point): MultiPolygon {
    return multipolygon.map((poly) => scalePolygon(poly, factor));
}

export function movePolygon(polygon: Polygon, shift: Point): Polygon {
    const [shiftX, shiftY] = shift;
    return polygon.map((contour) => (
        contour.map(([x, y]) => [x + shiftX, y + shiftY])
    ));
}

export function moveMultiPolygon(multipolygon: MultiPolygon, shift: Point): MultiPolygon {
    return multipolygon.map((poly) => movePolygon(poly, shift));
}

export function mapPolygonPoints(polygon: Polygon, func: (p: Point) => Point): Polygon {
    return polygon.map((contour) => contour.map(func));
}

export function mapMultiPolygonPoints(multipolygon: MultiPolygon, func: (p: Point) => Point): MultiPolygon {
    return multipolygon.map((poly) => mapPolygonPoints(poly, func));
}
