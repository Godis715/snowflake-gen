# Snowflake Generator

This repository contains source code of the Snowflake Generator package. This package provides function for procedural generation of snowflakes. Providing seed to generator makes creation of snowflakes reproducible.

## Disclaimer

This package is still under development and it shouldn't be used in production.

## Demo

Demo with example of snowfake generator usage is available [here](https://godis715.github.io/snowflake-gen/).

## Installation

## Example

```js
import generateSnowflake from "@godis715/snowflake-gen";

const snowflake = generateSnowflake();
```

Result of generator call is an array with type `MultiPolygon` or `[number, number][][][]` (`[number, number]` is 2d-point; array of points is a contour, array of contours is a polygon, where the first contour is considered as outer contour; array of polygons is a multipolygon). 
