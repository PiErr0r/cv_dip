

class Morphology {

	M_checkImage(image) {
		if (!(image instanceof ImageBinaryMatrix)) {
			throw new Error("Type Error: expected ImageBinaryMatrix");
		}
	}

	dilate(image, size = 3) {
		this.M_checkImage(image)

		let k = new Matrix(size);
		k = k.apply(() => 1); // fill with ones
		const G = _convBin(image, k, (res) => res);
		return new ImageBinaryMatrix(G)
	}

	erode(image, size = 3) {
		this.M_checkImage(image)

		let k = new Matrix(size);
		k = k.apply(() => 1); // fill with ones
		const G = _convBin(image, k, (res) => res === size * size);
		return new ImageBinaryMatrix(G)
	}

	majority(image, size = 3) {
		this.M_checkImage(image)

		let k = new Matrix(size);
		k = k.apply(() => 1); // fill with ones
		const G = _convBin(image, k, (res) => res >= (size * size / 2));
		return new ImageBinaryMatrix(G)
	}

	open(image, size = 3) {
		this.M_checkImage(image)

		return this.dilate(this.erode(image, size))
	}

	close(image, size = 3) {
		this.M_checkImage(image)

		return this.erode(this.dilate(image, size))
	}
}