import { MultiPolygon, Polygon, Point } from "../types";
export declare function rotatePolygon(polygon: Polygon, deg: number): Polygon;
export declare function rotateMultiPolygon(multipolygon: MultiPolygon, deg: number): MultiPolygon;
export declare function scalePolygon(polygon: Polygon, factor: Point): Polygon;
export declare function scaleMultiPolygon(multipolygon: MultiPolygon, factor: Point): MultiPolygon;
export declare function movePolygon(polygon: Polygon, shift: Point): Polygon;
export declare function moveMultiPolygon(multipolygon: MultiPolygon, shift: Point): MultiPolygon;
export declare function mapPolygonPoints(polygon: Polygon, func: (p: Point) => Point): Polygon;
export declare function mapMultiPolygonPoints(multipolygon: MultiPolygon, func: (p: Point) => Point): MultiPolygon;
//# sourceMappingURL=geomOperations.d.ts.map