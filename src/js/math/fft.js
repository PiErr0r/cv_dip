class FFT {
	_fft(C) {
		const N = C.length
		if (N === 1) {
			return;
		}

		// divide
		const even = [];
		const odd = [];
		for (let k = 0; k < C.length; ++k) {
			((k&1) ? odd : even).push(C[k].copy());
		}

		_fft(even);
		_fft(odd);
		// conquer
		for (let k = 0; k < N/2; ++k) {
			// for this purpose doesn't matter if we use -2pi or 2pi
			const z = new Complex(1, -2 * Math.PI * k / N).mul(odd[k]);
			C[k] = 		 even[k].copy().add(z);
			C[k+N/2] = even[k].copy().sub(z);
		}
	};

	fft(N) {
		const C = N.map(n => new Complex(n, 0));
		_fft(C);
		return C;
	};

	ifft(C) {
		for (let k = 0; k < C.length; ++k) {
			C[k].conj();
		}

		_fft(C);

		for (let k = 0; k < C.length; ++k) {
			C[k].div(C.length);
		}

		return C.map(c => Math.round(c.real()));
	};

	fft2(img) {
		if (!img.grayscale) {
			throw new Error("Not implemented");
		}

		// find the formula here
		// https://www.mathworks.com/help/matlab/ref/fft2.html
		// or 
		// https://namelessalgorithm.com/fft2d/


	}

	ifft2(img) {
		// find the formula here
		// https://www.mathworks.com/help/matlab/ref/ifft2.html
	}
}
