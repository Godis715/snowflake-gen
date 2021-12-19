// Taken from https://stackoverflow.com/questions/62323834/calculate-polygon-area-javascript
export function getOrientedArea(coords) {
    let area = 0;
  
    for (let i = 0; i < coords.length - 1; i++) {
      const [x1, y1] = coords[i];
      const [x2, y2] = coords[i + 1];
  
      area += x1 * y2 - x2 * y1
    }
  
    return area / 2;
}
