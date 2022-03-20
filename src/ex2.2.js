const { cos, sin, PI } = Math;

const getRect = (pts) => pts.map(([x, y, w]) => [x + 500, -y + 500]);

const drawPts = (pts) => {

	const ptsTrans = pts.map(pt => pt.add(20));
	ce.polygon(getRect(ptsTrans), { color: "cyan" });

	const phi = 30 * PI / 180;
	const mRot = new Matrix([
		[cos(phi), sin(phi), 0],
		[-sin(phi), cos(phi), 0],
		[0, 0, 1]
	]);
	const ptsRot = pts.map(pt => mRot.dot(pt));
	ce.polygon(getRect(ptsRot), { color: "green" });

	const phi2 = 60 * PI / 180;
	const mRig = new Matrix([
		[cos(phi2), sin(phi2), 20],
		[-sin(phi2), cos(phi2), 20],
		[0, 0, 1]
	]);
	const ptsRig = pts.map(pt => mRig.dot(pt));
	ce.polygon(getRect(ptsRig), { color: "blue" });

	const phi3 = 45 * PI / 180;
	const s = 0.5;
	const mRigSc = new Matrix([
		[cos(phi3) * s, sin(phi3) * s, 20],
		[-sin(phi3) * s, cos(phi3) * s, 20],
		[0, 0, 1]
	]);
	const ptsRigSc = pts.map(pt => mRigSc.dot(pt));
	ce.polygon(getRect(ptsRigSc), { color: "magenta" });

	const mAff = new Matrix([
		[0.1, 0.5, 2],
		[0.8, 0.3, 4],
		[0, 0, 1]
	]);
	const ptsAff = pts.map(pt => mAff.dot(pt));
	ce.polygon(getRect(ptsAff), { color: "orange" });

	const mProj = new Matrix([
		[0.2, 0.6, 50],
		[0.1, 0.8, 60],
		[0.002, 0.004, 0.5]
	]);
	const ptsProj = pts.map(pt => mProj.dot(pt))//.map(pt => pt.dot(1/pt[2]));
	ce.polygon(getRect(ptsProj), { color: "lime" });

	// const mOrig = mAff.inv();
	// const ptsOrig = ptsAff.map(pt => mOrig.dot(pt));
	// ce.polygon(getRect(ptsOrig), { color: "black" });	

}

function main() {
	// crs
	window.ce = new CanvasEditor();
	ce.point(500, 500, { size: 5 })
	ce.singleLine([500, 0], [500,500])
	ce.singleLine([500,500], [1000, 500])

	const pts = [[1, 1], [2, -1], [-1.5, -1], [-1.1, 1]].map(pt => new Vector([...pt, 0]).dot(100))
	ce.polygon(getRect(pts), { color: "red" });

	drawPts(pts);
}

window.onload = () => main();

/* TESTS
	ce.point(100, 100, { size: 20, label: "Hello world", color: "red" });
	ce.point(400, 400);

	ce.singleLine([0,0], [100, 20], { width: 3, color: "pink" });
	ce.singleLine([200,200], [300, 300]);

	ce.arc(800, 800, 20, PI/2, PI, { color: "green" });
	ce.circle(100, 900, 10, { width: 3, color: "blue" });

	ce.square(800, 100, 50, { width: 2 });
	ce.rect(600, 700, 30, 10, { color: "lime" });

	ce.line([[0,0],[20,20], [100, 20], [100, 100], [20, 100]], { width: 2, color: "cyan" });
	ce.polygon([[0,0],[20,20], [100, 20], [100, 100], [20, 100]].map(p => [p[0] + 510, p[1] + 510]), { width: 2, color: "crimson" });
*/