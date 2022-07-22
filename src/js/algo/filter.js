

class Filter {
	sobel(image, normalize, threshold = null) {
		const kx = new Matrix([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]);
		const ky = new Matrix([[-1, -2, -1], [0, 0, 0], [1, 2, 1]]);

		const Gx = _conv(image, kx);
		const Gy = _conv(image, ky);

		const res = new Matrix(...image.dim());
		const [h, w] = Gx.dim()
		for (let i = 0; i < h; ++i) {
			for (let j = 0; j < w; ++j) {
				const px = Math.sqrt(Gx[i][j] * Gx[i][j] + Gy[i][j] * Gy[i][j]);
				res[i][j] = px;
			}
		}
		const nImg = _fillImage(res, normalize);
		const [_h, _w] = image.dim();
		if (threshold !== null) {
			for (let i = 0; i < _h; ++i) {
				for (let j = 0; j < _w; ++j) {
					nImg[0][i][j] = nImg[0][i][j] >= threshold ? 255 : 0;
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

		const res = new Matrix(...image.dim());
		const [h, w] = Gx.dim();
		for (let i = 0; i < h; ++i) {
			for (let j = 0; j < w; ++j) {
				const px = Math.sqrt(Gx[i][j] * Gx[i][j] + Gy[i][j] * Gy[i][j]);
				res[i][j] = px;
			}
		}
		const nImg = _fillImage(res, normalize);
		const [_h, _w] = image.dim();
		if (threshold !== null) {
			for (let i = 0; i < _h; ++i) {
				for (let j = 0; j < _w; ++j) {
					nImg[0][i][j] = nImg[0][i][j] >= threshold ? 255 : 0;
				}
			}
		}
		return nImg;
	}

	gauss(image, kernelSize, sigma = 1) {
		if (kernelSize % 2 === 0) {
			throw new Error("kernelSize must be odd");
		}
		const k = this.getGaussKernel(kernelSize, sigma);
		const G = _conv(image, k);
		return _fillImage(G, false);
	}

	// Laplacian of Gaussian
	LoG(image, kernelSize, sigma = 1) {
		if (kernelSize % 2 === 0) {
			throw new Error("kernelSize must be odd");
		}
		const k = this.getLoGKernel(kernelSize, sigma);
		const G = _conv(image, k);
		return _fillImage(G, true);
	}

	getGaussKernel(kernelSize, sigma) {
		const kernel = new Matrix(kernelSize, kernelSize);
		const mid = kernelSize >> 1;
		const K = 1 / (2 * Math.PI * sigma * sigma);
		for (let i = 0; i < kernelSize; ++i) {
			for (let j = 0; j < kernelSize; ++j) {
				const x = -mid + j;
				const y = -mid + i;
				const D = Math.exp(-(x*x + y*y)/(2 * sigma * sigma));
				kernel[i][j] = K * D;
			}
		}
		return kernel;
	}

	getLoGKernel(kernelSize, sigma) {
		const kernel = new Matrix(kernelSize, kernelSize);
		const S2 = sigma * sigma;
		const S4 = S2 * S2;
		const mid = kernelSize >> 1;
		const K = -1 / (Math.PI * S4);
		for (let i = 0; i < kernelSize; ++i) {
			for (let j = 0; j < kernelSize; ++j) {
				const x = -mid + j;
				const y = -mid + i;
				const D = - (x*x + y*y) / (2 * S2);
				const D1 = 1 + D;
				const D2 = Math.exp(D);
				kernel[i][j] = K * D1 * D2;
			}
		}
		return kernel;
	}
}