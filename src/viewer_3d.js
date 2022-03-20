const FPS = 20;
const DX = 0.01;
const DY = 0.01;
const DTHETA = 0.01;
const SPEED = 1/FPS;

let cnt = 0;

class Viewer3D {
	constructor(id = "source") {
		this.canvas = document.getElementById(id);
		if (!this.canvas) {
			throw new Error(`No canvas element with id: ${id}`);
		}

		this.canvas.addEventListener('focus', this.register.bind(this));
		this.canvas.addEventListener('blur', this.unregister.bind(this));
		this.interval = null;

		this.keys = new Uint8Array(400).fill(0);
		this.T = new Uint8Array(4).fill(0); // left, up, right down - translation
		this.R = new Uint8Array(4).fill(0); // left, up, right down - rotation
		this.pos = new Float32Array(3).fill(0); // x, y, z
		this.rot = new Float32Array(2).fill(0) // yaw in [-180, 180], pitch in [-90, 90]

		this.worldRenderer = new WorldRenderer(this.canvas, this.pos, this.rot);
	}

	register() {
		this.canvas.style.border = "2px solid red";
		this.canvas.addEventListener('keydown', this.handleKeyDown.bind(this));
		this.canvas.addEventListener('keyup', this.handleKeyUp.bind(this));
		this.interval = setInterval(this.loop.bind(this), 1000 / FPS);
	}

	unregister() {
		this.canvas.style.border = "1px solid black";
		this.canvas.removeEventListener('keydown', this.handleKeyDown.bind(this));
		this.canvas.removeEventListener('keyup', this.handleKeyUp.bind(this));
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}
	}

	handleKeyDown(evt) {
		// prevent Tab from changing focus
		if (evt.keyCode == 9)  evt.preventDefault();
		if (this.keys[evt.keyCode]) {
			return
		}
		// console.log(evt.keyCode, 'down')
		this.keys[evt.keyCode] = 1;
		switch (evt.keyCode) {
			// case 65: this.T[0] = 1; break; // a
			case 87: this.T[1] = 1; break; // w
			// case 68: this.T[2] = 1; break; // d
			case 83: this.T[3] = 1; break; // s
			case 37: this.R[0] = 1; break; // left
			case 38: this.R[1] = 1; break; // up
			case 39: this.R[2] = 1; break; // right
			case 40: this.R[3] = 1; break; // down
			default: break; // do nothing
		}
	}

	handleKeyUp(evt) {
		// console.log(evt.keyCode, 'up')
		this.keys[evt.keyCode] = 0;
		switch (evt.keyCode) {
			// case 65: this.T[0] = 0; break; // a
			case 87: this.T[1] = 0; break; // w
			// case 68: this.T[2] = 0; break; // d
			case 83: this.T[3] = 0; break; // s
			case 37: this.R[0] = 0; break; // left
			case 38: this.R[1] = 0; break; // up
			case 39: this.R[2] = 0; break; // right
			case 40: this.R[3] = 0; break; // down
			default: break; // do nothing
		}
	}

	normalizeAngles() {
		const roll = Math.abs(this.rot[0]) > Math.PI ? Math.abs(this.rot[0]) - Math.PI : 0;
		const pitch = Math.abs(this.rot[1]) > Math.PI / 2 ? Math.abs(this.rot[1]) - Math.PI / 2 : 0;
		// const yaw = Math.abs(this.rot[2]) > Math.PI ? Math.abs(this.rot[2]) - Math.PI : 0;
		if (roll !== 0)
			this.rot[0] = -1 * Math.sign(this.rot[0]) * Math.PI + Math.sign(this.rot[0]) * roll;
		if (pitch !== 0)
		this.rot[1] = -1 * Math.sign(this.rot[1]) * Math.PI / 2 + Math.sign(this.rot[1]) * pitch;
		// this.rot[2] = -1 * Math.sign(this.rot[2]) * Math.PI + Math.sign(this.rot[2]) * yaw;
	}

	loop() {
		this.moveCamera();
		this.worldRenderer.render();
	}

	moveCamera() {
		// rotation
		this.normalizeAngles();
		if (this.R[0]) this.rot[0] += DTHETA;
		if (this.R[1]) this.rot[1] += DTHETA;
		if (this.R[2]) this.rot[0] -= DTHETA;
		if (this.R[3]) this.rot[1] -= DTHETA;

		// translation
		if (this.T[1] ^ this.T[3]) {
			const dx = Math.cos(this.rot[0]);
			const dy = Math.sin(this.rot[0]);
			const dz = Math.sin(this.rot[1]);
			this.pos[0] += SPEED * dx * (this.T[1] - this.T[3]);
			this.pos[1] += SPEED * dy * (this.T[1] - this.T[3]);
			this.pos[2] += SPEED * dz * (this.T[1] - this.T[3]);
		}
		// console.log(cnt)
		if (cnt % 50 === 0) {
			console.log("move", this.pos, this.rot);
		}
		++cnt;

	}
}
