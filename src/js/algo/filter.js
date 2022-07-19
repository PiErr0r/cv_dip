

class Filter {
	sobel(image, normalize, threshold = null) {
		const kx = new Matrix([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]);
		const ky = new Matrix([[-1, -2, -1], [0, 0, 0], [1, 2, 1]]);

		const Gx = _conv(image, kx);
		const Gy = _conv(image, ky);

		const res = new Matrix(image.height, image.width);

		for (let i = 0; i < Gx.length; ++i) {
			for (let j = 0; j < Gx[0].length; ++j) {
				const px = Math.sqrt(Gx[i][j] * Gx[i][j] + Gy[i][j] * Gy[i][j]);
				res[i][j] = px;
			}
		}
		const nImg = _fillImage(res, normalize);
		if (threshold !== null) {
			for (let i = 0; i < nImg.height; ++i) {
				for (let j = 0; j < nImg.width; ++j) {
					const px = nImg.g(i, j);
					nImg._s(i, j, 0, px >= threshold ? 255 : 0);
				}
			}
		}
		return nImg;
	}

	prewitt(image, normalize, threshold = null) {
		const kx = new Matrix([[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]]);
		const ky = new Matrix([[-1, -1, -1], [0, 0, 0], [1, 1, 1]]);

		const Gx = _conv(image, kx);
		const Gy = _conv(image, ky);

		const res = new Matrix(image.height, image.width);

		for (let i = 0; i < Gx.length; ++i) {
			for (let j = 0; j < Gx[0].length; ++j) {
				const px = Math.sqrt(Gx[i][j] * Gx[i][j] + Gy[i][j] * Gy[i][j]);
				res[i][j] = px;
			}
		}
		const nImg = _fillImage(res, normalize);
		if (threshold !== null) {
			for (let i = 0; i < nImg.height; ++i) {
				for (let j = 0; j < nImg.width; ++j) {
					const px = nImg.g(i, j);
					nImg._s(i, j, 0, px >= threshold ? 255 : 0);
				}
			}
		}
		return nImg;
	}

}