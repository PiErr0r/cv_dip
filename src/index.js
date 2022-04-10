const __COLORS = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","DarkOrange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen",];

function main() {
	const initialPose = {pos: [0, 0, 1], rot: [0, PI, 0]};
	const v3d = new Viewer3D(initialPose);
	let cnt = 0;
	const min = -100, max = 100;
	const k = 0;
	// const min = -1, max = 1;
	// const vertices = [[5,-1,-1],[5,-1,1],[5,1,1],[5,1,-1]];
	for (let i = min; i <= max; ++i) {
		for (let j = min; j <= max; ++j) {
			// for (let k = min; k <= max; ++k) {
				// console.log(i, j, k)
				// v3d.add('sphere', i/10 + Math.random(), j/10 + Math.random(), k/10 + Math.random(), { color: __COLORS[cnt++ % __COLORS.length], size: 0.05 });
				v3d.add('pixel', i*PX_SIZE, j*PX_SIZE, Math.random()*PX_SIZE, { color: __COLORS[cnt++ % __COLORS.length] });
				// v3d.add('sphere', i, j, k, { color: "red", size: 1 });
				// const f = [i, j, k];
				// const verts = [f, [f[0], f[1] + 1, f[2]], [f[0], f[1] + 1, f[2] + 1], [f[0], f[1], f[2] + 1]];
				// v3d.add('polygon', verts, { color: __COLORS[cnt++ % __COLORS.length] });
			// }
		}
	} 

	// this.entities = [ ['sphere', 5, 0, 0, { color: 'red', size: 2}] ];
}

function SORT (arr) {
	let inOrder = false;
	for (let i = arr.length - 1; i >= 0 && !inOrder; --i) {
		inOrder = true;
		for (let j = i - 1; j >= 0 && inOrder; --j) {
			while (j < arr.length - 1 && arr[j] < arr[j + 1]) {
				const tmp = arr[j];
				arr[j] = arr[j+1];
				arr[j+1] = tmp;
				inOrder = false;
				++j;
			}
			// if (arr[j] < arr[i]) {
			// }
		}
	}
}

function test() {
	const sz = 1000;
	console.time("bubble");
	for (let i = 0; i < 1000; ++i) {
		const arr = new Array(sz).fill(0).map(() => Math.floor(Math.random() * 10));
		// console.log([...arr])
		SORT(arr);
		let inOrder = true;
		// for (let j = 0; j > arr.length - 1; ++j) {
		// 	if (arr[j] < arr[j + 1]) {
		// 		inOrder = false;
		// 		break;
		// 	}
		// }
		if (!inOrder) {
			console.log("!!! NOT SORTED !!!")
		}
	}
	console.timeEnd("bubble");


	console.time("sort");
	for (let i = 0; i < 1000; ++i) {
		const arr = new Array(sz).fill(0).map(() => Math.floor(Math.random() * 10));
		arr.sort((a, b) => b-a);
		// console.log([...arr])
		// SORT(arr);
	}
	console.timeEnd("sort");

	// let inOrder = false;
	// for (let i = arr.length - 1; i >= 0 && !inOrder; --i) {
	// 	inOrder = true;
	// 	for (let j = arr.length - 1; j >= 0; --j) {

	// 	}
	// 	for (let j = i - 1; j >= 0; --j) {
	// 		if (arr[j] < arr[i]) {
	// 			const tmp = arr[j];
	// 			arr[j] = arr[i];
	// 			arr[i] = tmp;
	// 			inOrder = false;
	// 		}
	// 	}
	// }

	// console.log([...arr])
}

window.onload = main;
// window.onload = test;
