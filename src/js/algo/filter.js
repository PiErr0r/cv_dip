

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

	gauss(image, kernelSize, sigma) {
		if (kernelSize % 2 === 1) {
			throw new Error("kernelSize must be odd");
		}
		const k = this.getGaussKernel(kernelSize, sigma);
		const G = _conv(image, k);
		return _fillImage(G, false);
	}

	getGaussKernel(kernelSize, sigma) {
		const kernel = new Matrix(kernelSize, kernelSize);
		const mid = kernelSize >> 1;
		const K = 1 / (2 * Math.PI * sigma * sigma);
		for (let i = 0; i < kernelSize; ++i) {
			for (let j = 0; j < kernelSize; ++j) {
				const x = -mid + j;
				const y = -mid + i;
				const D = Math.exp(-(x + y)/(2 * sigma * sigma));
				kernel[i][j] = K * D;
			}
		}
		return kernel;
	}
}