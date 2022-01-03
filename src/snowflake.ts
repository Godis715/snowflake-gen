import * as polygonClipping from "polygon-clipping";
import {
    rotatePolygon,
    rotateMultiPolygon,
    scalePolygon,
    scaleMultiPolygon,
    movePolygon,
    mapMultiPolygonPoints
} from "./utils/geomOperations";
import { getOrientedArea } from "./utils/getOrientedArea";
import { clusterPoints } from "./utils/clusterPoints";
import * as seedrandom from "seedrandom";
import { Polygon, Point, MultiPolygon } from "./types";

function randInRange(min: number, max: number, rand: () => number): number {
    return min + rand() * (max - min);
}

function getClippingArea(): Polygon {
    return [[
        [0, 0],
        [Math.tan(Math.PI / 6), 1],
        [0, 1],
        [0, 0]
    ]];
}

function getSquare(): Polygon {
    return [[
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, 0]
    ]];
}

function generateRectangle(
    minWidth: number,
    maxWidth: number,
    minHeight: number,
    maxHeight: number,
    minShift: number,
    maxShift: number,
    rand: () => number
) {
    const shift: Point = [randInRange(minShift, maxShift, rand), randInRange(minShift, maxShift, rand)];
    const scale: Point = [randInRange(minWidth, maxWidth, rand), randInRange(minHeight, maxHeight, rand)];

    return movePolygon(
        scalePolygon(
            rotatePolygon(
                getSquare(),
                randInRange(0, 360, rand)
            ),
            scale,
        ),
        shift
    );
}

function clipShapes(shapes: Polygon[]): MultiPolygon {
    const clippingArea = getClippingArea();

    return polygonClipping.intersection(
        clippingArea,
        polygonClipping.union([], ...shapes)
    );
}

function hFlipMultiPolygon(multipolygon: MultiPolygon): MultiPolygon {
    return scaleMultiPolygon(multipolygon, [-1, 1]);
}

function generateSnowflakeParts(part: MultiPolygon): MultiPolygon[] {
    const snowflakeSector = [part, hFlipMultiPolygon(part)];

    return Array(6)
        .fill(0)
        .map((_, i) => snowflakeSector.map((sector) => rotateMultiPolygon(sector, 60 * i)))
        .flat();
}

function getPointHash(point: Point): string {
    return `${point[0]}, ${point[1]}`;
}

function mergeClosePoints(multipolygons: MultiPolygon[], eps: number): MultiPolygon[] {
    const points = multipolygons.flat(3);

    const [assignments, clusterCenters] = clusterPoints(points, eps);

    const newPoints = Object.fromEntries(
        assignments.map((clusterIdx, pointIdx) => {
            return  [
                getPointHash(points[pointIdx]),
                clusterCenters[clusterIdx]
            ];
        })
    );

    return multipolygons.map(
        (part) => mapMultiPolygonPoints(
            part,
            (p) => newPoints[getPointHash(p)]
        )
    );
}

function removeSmallContours(polygon: Polygon, squareEps: number): Polygon {
    if (Math.abs(getOrientedArea(polygon[0])) <= squareEps) {
        return [];
    }

    return polygon.filter(
        (poly) => Math.abs(getOrientedArea(poly)) > squareEps
    );
}

function removeSmallPolygons(multipolygon: MultiPolygon, eps: number): MultiPolygon {
    return multipolygon
        .map((poly) => removeSmallContours(poly, eps))
        .filter((poly) => poly.length > 0);
}

type GeneratorOptions = Partial<{
    shapesNum: number,
    minShapeSize: number,
    maxShapeSize: number,
    seed: number
}>;

export function generateSnowflake(options: GeneratorOptions = {}) {
    const {
        shapesNum = 10,
        minShapeSize = 0.05,
        maxShapeSize = 0.4,
        seed = 42
    } = options;

    const rand = seedrandom(seed.toString());

    const generateRect = () => generateRectangle(minShapeSize, maxShapeSize, minShapeSize, maxShapeSize, -0.2, 0.7, rand);
    const generateLine = () => generateRectangle(minShapeSize, minShapeSize, maxShapeSize / 2, maxShapeSize, -0.3, 1, rand);

    const skeleton = rotatePolygon(scalePolygon(getSquare(), [minShapeSize, randInRange(0, 1, rand)]), randInRange(-10, 0, rand));

    const rectangles = Array(shapesNum).fill(0).map(generateRect);
    const lines = Array(shapesNum * 3).fill(0).map(generateLine);

    const shapes = [skeleton].concat(rectangles).concat(lines);
    const snowflakePart = clipShapes(shapes);
    const snowflakeParts = generateSnowflakeParts(snowflakePart);
    const correctedSnowflake = mergeClosePoints(snowflakeParts, 0.0001);
    const snowflake = polygonClipping.union([], ...correctedSnowflake);
    const filteredSnoflwake = removeSmallPolygons(snowflake, 0.01);

    return filteredSnoflwake;
}
