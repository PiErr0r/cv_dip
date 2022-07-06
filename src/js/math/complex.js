

class Complex {
	constructor(r, phi) {
		this.r = r;
		this.phi = phi;
		this.resetAngleOverflow();
	}

	// create a new copy of this number
	copy() {
		return new Complex(this.r, this.phi);
	}

	real() {
		return Math.cos(this.phi) * this.r
	}

	imag() {
		return Math.sin(this.phi) * this.r
	}

	_algAddSub(z, algFn) {
		const [realOther, imagOther] = Complex.toPlanar(z);
		const [realMe, imagMe] = Complex.toPlanar(this);
		const resReal = algFn(realMe, realOther);
		const resImag = algFn(imagMe, imagOther);

		const [r, phi] = Complex.toPolar(resReal, resImag);
		this.r = r;
		this.phi = phi;
		this.resetAngleOverflow();
		return this;
	}

	// add another complex number to this one
	add(z) {
		return this._algAddSub(z, (a, b) => a + b);
	}

	// subtract complex number from this
	sub(z) {
		return this._algAddSub(z, (a, b) => a - b);
	}

	// negate this complex number
	neg() {
		this.phi += Math.PI;
		this.resetAngleOverflow();
		return this;
	}

	_algMulDiv(z, mulDivFn, addSubFn) {
		const isDiv = mulDivFn(2, 2) === 1;
		if (typeof z === "number") {
			if (isDiv && z === 0) {
				throw new Error("Division by zero!");
			}
			this.r = mulDivFn(this.r, z);
		} else {
			if (isDiv && z.r === 0) {
				throw new Error("Division by zero!");
			}
			this.r = mulDivFn(this.r, z.r);
			this.phi = addSubFn(this.phi, z.phi);
			this.resetAngleOverflow();
		}
		return this;
	}

	// multiply this with complex number
	mul(z) {
		return this._algMulDiv(z, (a, b) => a * b, (a, b) => a + b);
	}

	// divide this with complex number
	div(z) {
		return this._algMulDiv(z, (a, b) => a / b, (a, b) => a - b);
	}

	// complex conjugate of this
	conj() {
		this.phi = -this.phi;
		return this;
	}

	// modulo 2*pi the angle
	resetAngleOverflow() {
		const rounds = Math.floor(Math.abs(this.phi) / (2 * Math.PI));
		this.phi = this.phi + Math.sign(-this.phi) * rounds * 2 * Math.PI;		
	}

	// polar to planar
	static toPlanar(z) {
		const real = z.r * Math.cos(z.phi);
		const imag = z.r * Math.sin(z.phi);
		return [real, imag];
	}

	// planar to polar
	static toPolar(real, imag) {
		const r = Math.sqrt(real**2 + imag**2);
		const phi = Math.atan2(imag , real);
		return [r, phi];
	}
}
