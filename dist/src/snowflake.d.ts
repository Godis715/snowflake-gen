import { MultiPolygon } from "./types";
declare type GeneratorOptions = Partial<{
    shapesNum: number;
    minShapeSize: number;
    maxShapeSize: number;
    seed: number;
}>;
export declare function generateSnowflake(options?: GeneratorOptions): MultiPolygon;
export {};
//# sourceMappingURL=snowflake.d.ts.map