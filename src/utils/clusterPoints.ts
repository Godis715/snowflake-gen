import { euclideanDistSquared } from "./euclideanDistSquared";
import { Point } from "../types";

function mergeClusters(assignments: number[], i1: number, i2: number): void {
    let c1 = assignments[i1];
    let c2 = assignments[i2];
    if (c1 > c2) {
        const c3 = c1;
        c1 = c2;
        c2 = c3;
    }

    assignments.forEach((c, i) => {
        if (c === c2) {
            assignments[i] = c1;
        }
    });
}

function getCentroid(points: Point[]): Point {
    if (points.length === 0) {
        return [NaN, NaN];
    }

    if (points.length === 1) {
        return points[0];
    }

    const x = points.reduce((acc, p) => acc + p[0], 0) / points.length;
    const y = points.reduce((acc, p) => acc + p[1], 0) / points.length;

    return [x, y];
}

function renameAssignments(assignments: number[]): void {
    const clusterIdxMap: Record<number, number> = {};
    let maxIdx = -1;
    assignments.forEach((clusterIdx, i) => {
        if (clusterIdxMap[clusterIdx] === undefined) {
            clusterIdxMap[clusterIdx] = ++maxIdx;
        }

        assignments[i] = clusterIdxMap[clusterIdx];
    });
}

export function clusterPoints(points: Point[], eps: number): [number[], Point[]] {
    const assignments = points.map((_, i) => i);
    points.forEach((p1, i1) => {
        points.forEach((p2, i2) => {
            if (euclideanDistSquared(p1, p2) <= eps * eps) {
                mergeClusters(assignments, i1, i2);
            }
        });
    });

    renameAssignments(assignments);

    const maxClusterIdx = Math.max(...assignments);
    const clusters = Array(maxClusterIdx + 1).fill(undefined).map(() => []);

    points.forEach((p, i) => {
        const clusterIdx = assignments[i];
        clusters[clusterIdx].push(p);
    });

    const clusterCenters = clusters.map(getCentroid);

    return [assignments, clusterCenters];
}
