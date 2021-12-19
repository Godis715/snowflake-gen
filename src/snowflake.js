import polygonClipping from "polygon-clipping";
import {
    rotatePolygon,
    rotateMultiPolygon,
    scalePolygon,
    scaleMultiPolygon,
    movePolygon,
    mapMultiPolygonPoints
} from "./utils/geomOperations";
import jDBSCAN from "./deps/jDBScan";
import { getOrientedArea } from "./utils/getOrientedArea";
import seedrandom from "seedrandom";

function randInRange(min, max, rand) {
    return min + rand() * (max - min);
}

function getClippingArea() {
    return [[
        [0, 0],
        [Math.tan(Math.PI / 6), 1],
        [0, 1],
        [0, 0]
    ]];
}

function getSquare() {
    return [[
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, 0]
    ]];
}

function generateRectangle(minWidth, maxWidth, minHeight, maxHeight, minShift, maxShift, rand) {
    const shift = [randInRange(minShift, maxShift, rand), randInRange(minShift, maxShift, rand)];
    const scale = [randInRange(minWidth, maxWidth, rand), randInRange(minHeight, maxHeight, rand)];

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

function clipShapes(shapes) {
    const clippingArea = getClippingArea();

    return polygonClipping.intersection(
        clippingArea,
        polygonClipping.union(...shapes)
    );
}

function hFlipMultiPolygon(multipolygon) {
    return scaleMultiPolygon(multipolygon, [-1, 1]);
}

function generateSnowflakeParts(part) {
    const snowflakeSector = [part, hFlipMultiPolygon(part)];

    return Array(6)
        .fill(0)
        .map((_, i) => snowflakeSector.map((sector) => rotateMultiPolygon(sector, 60 * i)))
        .flat();
}

function getPointHash(point) {
    return `${point[0]}, ${point[1]}`;
}

function mergeClosePoints(multipolygons, eps) {
    const points = multipolygons.flat(3);

    const dbscanner = jDBSCAN()
        .eps(eps)
        .minPts(1)
        .distance("EUCLIDEAN")
        .data(points.map(([x, y]) => ({ x, y })));

    const assignments = dbscanner();
    const clusterCenters = dbscanner.getClusters().map((c) => [c.x, c.y]);

    const newPoints = Object.fromEntries(
        assignments.map((assignment, i) => {
            const clusterIdx = assignment - 1;

            return  [
                getPointHash(points[i]),
                clusterIdx === -1 ? points[i] : clusterCenters[clusterIdx]
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

function removeSmallContours(polygon, squareEps) {
    if (Math.abs(getOrientedArea(polygon[0])) <= squareEps) {
        return [];
    }

    return polygon.filter(
        (poly) => Math.abs(getOrientedArea(poly)) > squareEps
    );
}

function removeSmallPolygons(multipolygon, eps) {
    return multipolygon
        .map((poly) => removeSmallContours(poly, eps))
        .filter(Boolean);
}

export function generateSnowflake(options = {}) {
    const {
        shapesNum = 10,
        minShapeSize = 0.05,
        maxShapeSize = 0.4,
        seed = 42
    } = options;

    const rand = seedrandom(seed);

    const generateRect = () => generateRectangle(minShapeSize, maxShapeSize, minShapeSize, maxShapeSize, -0.2, 0.7, rand);
    const generateLine = () => generateRectangle(minShapeSize, minShapeSize, maxShapeSize / 2, maxShapeSize, -0.3, 1, rand);

    const skeleton = rotatePolygon(scalePolygon(getSquare(), [minShapeSize, randInRange(0, 1, rand)]), randInRange(-10, 30, rand));

    const rectangles = Array(shapesNum).fill(0).map(generateRect);
    const lines = Array(shapesNum * 3).fill(0).map(generateLine);

    const shapes = [skeleton].concat(rectangles).concat(lines);
    const snowflakePart = clipShapes(shapes);
    const snowflakeParts = generateSnowflakeParts(snowflakePart);
    const correctedSnowflake = mergeClosePoints(snowflakeParts, 0.0001);
    const snowflake = polygonClipping.union(...correctedSnowflake);
    const simplifiedSnowflake = removeSmallPolygons(snowflake, 0.01);

    return simplifiedSnowflake;
}
