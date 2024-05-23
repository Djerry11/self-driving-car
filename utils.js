//gives the position between A and B based on the value of t
function lerp(A, B, t) {
  return A + (B - A) * t;
}

//gives the intersection point between two lines AB and CD
function getIntersection(A, B, C, D) {
  const tTop = (A.y - C.y) * (D.x - C.x) - (A.x - C.x) * (D.y - C.y);
  const uTop = (A.x - B.x) * (C.y - A.y) - (A.y - B.y) * (C.x - A.x);
  const Bottom = (B.x - A.x) * (D.y - C.y) - (B.y - A.y) * (D.x - C.x);

  if (Bottom != 0) {
    const t = tTop / Bottom;
    const u = uTop / Bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }
  return null;
}

function polyIntersect(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const touch = getIntersection(
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(j + 1) % poly2.length]
      );
      if (touch) {
        return true;
      }
    }
  }
}

function getRGBA(value) {
  const alpha = Math.abs(value);
  const R = value < 0 ? 0 : 255;
  const G = R;
  const B = value > 0 ? 0 : 255;
  return "rgba(" + R + "," + G + ", " + B + ", " + alpha + ")";
}
