import { Point } from "../types";

export function euclideanDistSquared(p1: Point, p2: Point): number {
    const x = (p1[0] - p2[0]);
    const y = (p1[1] - p2[1]);
    return x * x + y * y;
}
