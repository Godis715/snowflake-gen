import { generateSnowflake } from  "./snowflake";

function drawPolygon(ctx, polygon) {
    polygon.forEach((contour) => {
        ctx.moveTo(...contour[0]);
        contour.slice(1).forEach(([x, y]) => ctx.lineTo(x, y));
        ctx.closePath();
    });

    ctx.fillStyle = "#FF0000";
    ctx.fill();
}

function drawMultiPolygon(ctx, multipolygon) {
    multipolygon.forEach((poly) => drawPolygon(ctx, poly));
}

function drawSvgPolygon(polygon) {
    const dAttr = polygon.map(
        (contour) => contour
            .map((p, i) => (i === 0 ? "M" : "L") + p.join(" "))
            .join(" ") + "z"
    ).join(" ");

    return `<path d="${dAttr}" />`;
}

function drawMultiSvgPolygon(multipolygon) {
    return multipolygon.map(drawSvgPolygon).join("\n")
}

const snowflakeSvg = document.getElementById("snowflake");
const snowflakeSvg2 = document.getElementById("snowflake2");

const snowflake = generateSnowflake({ seed: Math.random() });
const snowflake2 = generateSnowflake({ seed: Math.random(), maxShapeSize: 0.2 });

snowflakeSvg.innerHTML = drawMultiSvgPolygon(snowflake);
snowflakeSvg2.innerHTML = drawMultiSvgPolygon(snowflake2);
