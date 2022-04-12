// https://en.wikipedia.org/wiki/Perlin_noise#Implementation

function interpolate(a0, a1, w) {
	if (0.0 > w) return a0;
	if (1.0 < w) return a1;
	return (a1 - a0) * w + a0;
	// return (a1 - a0) * (3.0 - w * 2.0) * w * w + a0;
	// return (a1 - a0) * ((w * (w * 6.0 - 15.0) + 10.0) * w * w * w) + a0;
  /* // Use this cubic interpolation [[Smoothstep]] instead, for a smooth appearance:
   * return (a1 - a0) * (3.0 - w * 2.0) * w * w + a0;
   *
   * // Use [[Smootherstep]] for an even smoother result with a second derivative equal to zero on boundaries:
   * return (a1 - a0) * ((w * (w * 6.0 - 15.0) + 10.0) * w * w * w) + a0;
   */
}

function randomGradient(ix, iy) {
  // No precomputed gradients mean this works for any number of grid coordinates
  const w = 8 * 4;
  const s = w / 2; // rotation width
  let a = ix, b = iy;
  a *= 3284157443; b ^= a << s | a >>> w-s;
  b *= 1911520717; a ^= b << s | b >>> w-s;
  a *= 2048419325;
  const random = a * (3.14159265 / ~(~0 >>> 1)); // in [0, 2*Pi]
  return [Math.cos(random), Math.sin(random)];
}

function dotGridGradient(ix, iy, x, y) {
	const gradient = randomGradient(ix, iy);
	const dx = x - ix;
	const dy = y - iy;
	return dx * gradient[0] + dy * gradient[1];
}

function perlin(x, y) {
	const x0 = Math.floor(x);
	const x1 = x0 + 1;
	const y0 = Math.floor(y);
	const y1 = y0 + 1;

	const sx = x - x0;
	const sy = y - y0;

	let n0, n1;
	n0 = dotGridGradient(x0, y0, x, y);
	n1 = dotGridGradient(x1, y0, x, y);
	const ix0 = interpolate(n0, n1, sx);

	n0 = dotGridGradient(x0, y1, x, y);
	n1 = dotGridGradient(x1, y1, x, y);
	const ix1 = interpolate(n0, n1, sx);	

	const value = interpolate(ix0, ix1, sy);
	return value;
}