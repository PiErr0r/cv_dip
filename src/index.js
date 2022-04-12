
function initViewer(data, w, h) {
	const initialPose = {pos: [0, 0, 1], rot: [0, PI, 0]};
	const v3d = new Viewer3D(initialPose);

	console.log("getting ready")

	for (let i = 0; i < h; ++i) {
		console.log("row", i)
		for (let j = 0; j < w; ++j) {
			const r = data.data[i * 4 * w + 4 * j];
			const g = data.data[i * 4 * w + 4 * j + 1];
			const b = data.data[i * 4 * w + 4 * j + 2];
			if (!r && !g && !b) continue;
			const color = getColor(r, g, b);
			const x = (i - (w>>1))*PX_SIZE;
			const y = (j - (h>>1))*PX_SIZE;
			const z = perlin(x, y);
			v3d.add('sphere', x, y, z, { color, size: 2*PX_SIZE })
		}
	}
	console.log("ready")	
}

function init3d() {
	const img = document.getElementById('image-container');
	const canvas = document.getElementById('image-data');
	const w = img.width, h = img.height;
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0);
	const data = ctx.getImageData(0, 0, w, h);
	initViewer(data, w, h);
}

var img;
function main() {
	img = new Img();
	initImagePicker((evt) => img.changeSrc(evt)).then((res) => {
		console.log("initialization", res);
		const imgContainer = document.getElementById('image-container');
		imgContainer.addEventListener("load", (evt) => img.onImageLoad(evt));
	})
}

window.onload = main;
