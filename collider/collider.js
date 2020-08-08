function lineIntersect(p0, p1, p2, p3) {
   var A1 = p1.y - p0.y,
      B1 = p0.x - p1.x,
      C1 = A1 * p0.x + B1 * p0.y,
      A2 = p3.y - p2.y,
      B2 = p2.x - p3.x,
      C2 = A2 * p2.x + B2 * p2.y,
      denominator = A1 * B2 - A2 * B1;

   return {
      x: (B2 * C1 - B1 * C2) / denominator,
      y: (A1 * C2 - A2 * C1) / denominator
   }
}

function segmentIntersect(p0, p1, p2, p3) {
   var A1 = p1.y - p0.y,
      B1 = p0.x - p1.x,
      C1 = A1 * p0.x + B1 * p0.y,
      A2 = p3.y - p2.y,
      B2 = p2.x - p3.x,
      C2 = A2 * p2.x + B2 * p2.y,
      denominator = A1 * B2 - A2 * B1;

   if(denominator == 0) {
      return null;
   }

   var intersectX = (B2 * C1 - B1 * C2) / denominator,
      intersectY = (A1 * C2 - A2 * C1) / denominator,
      rx0 = (intersectX - p0.x) / (p1.x - p0.x),
      ry0 = (intersectY - p0.y) / (p1.y - p0.y),
      rx1 = (intersectX - p2.x) / (p3.x - p2.x),
      ry1 = (intersectY - p2.y) / (p3.y - p2.y);

   if(((rx0 >= 0 && rx0 <= 1) || (ry0 >= 0 && ry0 <= 1)) && 
      ((rx1 >= 0 && rx1 <= 1) || (ry1 >= 0 && ry1 <= 1))) {
      return {
         x: intersectX,
         y: intersectY
      };
   }
   else {
      return null;
   }
}

function circleIntersect(circleA, circleB) {
  var a, dx, dy, d, h, rx, ry;
  var x2, y2;

  // dx and dy are the vertical and horizontal distances between the circle centers.
  dx = circleB.position.x - circleA.position.x;
  dy = circleB.position.y - circleA.position.y;

  // Distance between the centers
  d = Math.sqrt(dy * dy + dx * dx);

  // Check for solvability
  if (d > circleA.radius + circleB.radius) {
    // No solution: circles don't intersect
    return false;
  }
  if (d < Math.abs(circleA.radius - circleB.radius)) {
    // No solution: one circle is contained in the other
    return false;
  }

  /* 'point 2' is the point where the line through the circle
   * intersection points crosses the line between the circle
   * centers.
   */

  /* Determine the distance from point 0 to point 2. */
  a =
    (circleA.radius * circleA.radius -
      circleB.radius * circleB.radius +
      d * d) /
    (2.0 * d);

  /* Determine the coordinates of point 2. */
  x2 = circleA.position.x + (dx * a) / d;
  y2 = circleA.position.y + (dy * a) / d;

  /* Determine the distance from point 2 to either of the
   * intersection points.
   */
  h = Math.sqrt(circleA.radius * circleA.radius - a * a);

  /* Now determine the offsets of the intersection points from
   * point 2.
   */
  rx = -dy * (h / d);
  ry = dx * (h / d);

  /* Determine the absolute intersection points. */
  var xi = x2 + rx;
  var xi_prime = x2 - rx;
  var yi = y2 + ry;
  var yi_prime = y2 - ry;

  return [xi, yi, xi_prime, yi_prime];
}