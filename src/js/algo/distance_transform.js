

class DistanceTransform {

	DT_checkImage(image) {
		if (!(image instanceof ImageBinaryMatrix)) {
			throw new Error("Type Error: expected ImageBinaryMatrix");
		}
	}


	distanceTransform(image, mul = 0) {
		this.DT_checkImage(image);
		const [h, w] = image.dim();
		const res = new ImageMatrix(h, w);
		for (let i = 1; i < h; ++i) {
			for (let j = 1; j < w; ++j) {
				if (image[i][j]) {
					res[0][i][j] = Math.min(res[0][i-1][j], res[0][i][j-1]) + 1;
				}
			}
		}

		for (let i = h - 2; i >= 0; --i) {
			for (let j = w - 2; j >= 0; --j) {
				if (image[i][j]) {
					res[0][i][j] = (Math.min(res[0][i+1][j] + 1, res[0][i][j+1] + 1, res[0][i][j]));	
				}
			}
		}

		if (mul !== 0) {
			for (let i = 0; i < h; ++i) {
				for (let j = 0; j < w; ++j) {
					res[0][i][j] *= mul;
				}
			}
		}

		return res;
	}
}