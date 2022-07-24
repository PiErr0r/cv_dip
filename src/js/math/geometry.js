const EPSILON = 1000;

// https://lucidar.me/en/mathematics/check-if-a-point-belongs-on-a-line-segment/
// pt = C, ls = [A, B]
function isPointOnLineSegment(pt, ls) {
	const [cx, cy] = pt;
	const [[ax, ay], [bx, by]] = ls;
	const a = new Vector([ax, ay, 0]);
	const b = new Vector([bx, by, 0]);
	const c = new Vector([cx, cy, 0]);
	const ab = a.add(b.neg());
	const ac = a.add(c.neg());

	// check if pt C is on the line made by A and B
	const isAligned = ab.cross(ac).reduce((acc, curr) => acc && Math.abs(curr) < EPSILON, true);
	// console.log("#",isAligned, ab.cross(ac))
	// console.log(a, b, c)
	// console.log(ab, ac)
	if (!isAligned) return false;

	// check if C is between points A and B
	const Kac = ab.dot(ac);
	const Kab = ab.dot(ab);
	return 0 <= Kac && Kac <= Kab;
}