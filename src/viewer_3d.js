let cnt = 0;

const eye = (n) => new Matrix(n).eye();
const eye3 = () => new Matrix3().eye();
const eye4 = () => new Matrix4().eye();

const getRotationMatrix = (axis, angle) => {
	const C = Math.cos(angle), S = Math.sin(angle);
	switch (axis) {
		case 'x': return new Matrix4([[1,0,0,0],[0,C,-S,0],[0,S,C,0],[0,0,0,1]]);
		case 'y': return new Matrix4([[C,0,S,0],[0,1,0,0],[-S,0,C,0],[0,0,0,1]]);
		case 'z': return new Matrix4([[C,-S,0,0],[S,C,0,0],[0,0,1,0],[0,0,0,1]]);
		default:  throw new Error(`Unknown axis provided: ${axis}`);
	}
}

const getTranslationMatrix = (x, y, z) => new Matrix4([[1,0,0,x],[0,1,0,y],[0,0,1,z],[0,0,0,1]]);

class Viewer3D {
	constructor(initialPose, id = "source") {
		this.canvas = document.getElementById(id);
		if (!this.canvas) {
			throw new Error(`No canvas element with id: ${id}`);
		}

		this.keys = new Uint8Array(400).fill(0);
		this.move = new Uint8Array(4).fill(0); // left, up, right down - translation
		this.rotate = new Uint8Array(4).fill(0); // left, up, right down - rotation

		// initial camera rotation
		const { pos, rot } = initialPose;
		this.T = Matrix.eye(4);
		this.recalculateT(pos, rot);

		this.entityManager = new EntityManager();
		this.worldRenderer = new WorldRenderer(this.canvas, this.entityManager);

		this.canvas.addEventListener('focus', this.register.bind(this));
		this.canvas.addEventListener('blur', this.unregister.bind(this));
		this.interval = null;
	}

	add(...entity) {
		const [type] = entity;
		const method = `add${capitalize(type)}`;
		if (!(method in this.entityManager)) {
			throw new Error(`Entity type ${type} not implemented!`);
		}
		const pos = this.T.map(r => r[3]);
		this.entityManager.setPosition(pos);
		this.entityManager[method](...entity.slice(1));
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

		this.keys[evt.keyCode] = 1;
		switch (evt.keyCode) {
			case 65: this.move[0] = 1; break; // a
			case 87: this.move[1] = 1; break; // w
			case 68: this.move[2] = 1; break; // d
			case 83: this.move[3] = 1; break; // s
			case 37: this.rotate[0] = 1; break; // left
			case 38: this.rotate[1] = 1; break; // up
			case 39: this.rotate[2] = 1; break; // right
			case 40: this.rotate[3] = 1; break; // down
			default: break; // do nothing
		}
	}

	handleKeyUp(evt) {
		this.keys[evt.keyCode] = 0;
		switch (evt.keyCode) {
			case 65: this.move[0] = 0; break; // a
			case 87: this.move[1] = 0; break; // w
			case 68: this.move[2] = 0; break; // d
			case 83: this.move[3] = 0; break; // s
			case 37: this.rotate[0] = 0; break; // left
			case 38: this.rotate[1] = 0; break; // up
			case 39: this.rotate[2] = 0; break; // right
			case 40: this.rotate[3] = 0; break; // down
			default: break; // do nothing
		}
	}

	loop() {
		// console.time("loop");
		const cameraDidMove = this.moveCamera();
		if (cameraDidMove) {
			this.worldRenderer.render(this.T);
		}
		// console.timeEnd("loop");
	}

	recalculateT(pos, rot) {
		const [x, y, z] = pos;
		const [roll, pitch, yaw] = rot;
		const s1 = Math.sin(roll), c1 = Math.cos(roll);
		const s2 = Math.sin(yaw), c2 = Math.cos(yaw);
		const s3 = Math.sin(pitch), c3 = Math.cos(pitch);
		this.T = this.T
			.dot(new Matrix4([
					[c1*c2, c1*s2*s3 - c3*s1, s1*s3 + c1*c3*s2, x],
					[c2*s1, c1*c3 + s1*s2*s3, c3*s1*s2 - c1*s3, y],
					[-s2,   c2*s3,            c2*c3,            z],
					[0,     0,                0,                1]
				]));
	}

	moveCamera() {
		// translation
		const pos = new Float32Array(3).fill(0);
		if (this.move[0]) pos[0] =  DX;
		if (this.move[1]) pos[2] =  DZ;
		if (this.move[2]) pos[0] = -DX;
		if (this.move[3]) pos[2] = -DZ;

		// rotation
		const rot = new Float32Array(3).fill(0)
		if (this.rotate[0]) rot[2] =  DTHETA;
		if (this.rotate[1]) rot[1] =  DTHETA;
		if (this.rotate[2]) rot[2] = -DTHETA;
		if (this.rotate[3]) rot[1] = -DTHETA;

		if (rot.every(r => r === 0) && pos.every(p => p === 0)) {
			return false;
		}

		this.recalculateT(pos, rot);

		if (false && cnt % 50 === 0) {
			console.log("pos", {
				x: Math.abs(this.T[0][3]) < EPS ? 0 : this.T[0][3], 
				y: Math.abs(this.T[1][3]) < EPS ? 0 : this.T[1][3], 
				z: Math.abs(this.T[2][3]) < EPS ? 0 : this.T[2][3],
			});
			const alpha = Math.atan(this.T[1][0] / this.T[0][0]);
			const beta = Math.atan(-this.T[2][0] / Math.sqrt(1 - this.T[2][0] * this.T[2][0]));
			const gamma = Math.atan(this.T[2][1] / this.T[2][2]);
			console.log("rot", [alpha, beta, gamma])
			// console.log(this.T.toString())
		}
		++cnt;
		return true;
	}
}
