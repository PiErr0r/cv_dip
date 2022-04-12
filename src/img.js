

class Img {
	constructor() {
		this.source = document.getElementById('source');
		this.ctxSource = this.source.getContext('2d');
		this.target = document.getElementById('target');
		this.ctxTarget = this.target.getContext('2d');

		this.size = null;
	}

	changeSrc(evt) {
		const src = evt.target.value;
		if (!src || !src.length) return;
		const img = document.getElementById('image-container');
		img.src = `imgs/${src}`;
	}

	onImageLoad(evt) {
		const image = evt.target;
		const w = image.width, h = image.height;
		this.size = { w, h };
	}
}