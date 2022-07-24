

const BinaryMatrixHandler = {
	set: (target, prop, value) => {
		target[prop] = value < 0 ? 0 : value > 1 ? 1 : Math.round(value);
	}
}

class ImageBinaryMatrix extends Matrix {
	constructor(hOrImageData, wOrThreshold = null) {
		if (typeof hOrImageData === 'number') {
			const [h, w] = [hOrImageData, wOrThreshold || hOrImageData];
			super(h, w);
		} else {
			const [h, w] = hOrImageData.dim();
			super(h, w);

			if (!hOrImageData.grayscale && !(hOrImageData instanceof Matrix)) {
				throw new Error("Cannot create binary image from rgb image")
			}

			const threshold = wOrThreshold || 1;
			for (let i = 0; i < h; ++i) {
				for (let j = 0; j < h; ++j) {
					let data = 0;
					data = (hOrImageData instanceof Matrix ? hOrImageData : hOrImageData[0])[i][j];
					this[i][j] = data >= threshold ? 1 : 0;
				}
			}
		}

		for (let i = 0; i < this.length; ++i) {
			this[i] = new Proxy(this[i], BinaryMatrixHandler);
		}
	}
}

