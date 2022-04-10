function getColor(r, g, b) {
	const f = Math.floor;
	const map = {10:'a',11:'b',12:'c',13:'d',14:'e',15:'f'};
	const handler = {get(t, p){return p < 10 ? f(p) : t[f(p)]}};
	const M = new Proxy(map, handler);
	return `#${M[r/16]}${M[r%16]}${M[g/16]}${M[g%16]}${M[b/16]}${M[b%16]}`;
}

function createOption(filename) {
	const [name, ext] = filename.split('.');
	if (ext === 'tif' || ext === 'tiff') return null;
	const option = document.createElement('option');
	option.innerText = name;
	option.id = name.toLowerCase();
	option.value = filename;
	return option;
}

function initImagePicker(handleChange) {
	const picker = document.getElementById("image-picker");
	return fetch("imgs/index.txt").then(r => r.text()).then(resp => {
		const imgs = resp.split("\n");
		imgs.forEach(img => {
			const option = createOption(img);
			if (option !== null)
				picker.appendChild(option);
		});
		picker.addEventListener('change', handleChange);
		return "Done";
	});
}

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

function imageChange(evt) {
	const name = evt.target.value;
	if (!name || !name.length) return;
	const img = document.getElementById('image-container');
	img.src = `imgs/${name}`;
}

function main() {
	initImagePicker(imageChange).then((res) => {
		console.log("initialization", res);
		const img = document.getElementById('image-container');
		img.addEventListener("load", init3d);
	})
}

window.onload = main;
