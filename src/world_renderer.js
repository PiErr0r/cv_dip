const POINT_SIZE = 5;
const LINE_WIDTH = 1;
const DEFAULT_COLOR = "#000000";

const F = 2.4;
const SCALE = 2;
const W = 16 / SCALE;
const H = 9 / SCALE;

class WorldRenderer {
	constructor(canvas, pos, rot) {
		this.canvas = canvas;
		this.pos = pos;
		this.rot = rot;

		this.ctx = this.canvas.getContext('2d');
		this.entities = [ ['sphere', 5, 0, 0, { color: 'red', size: 2}] ];
		this.R = new Matrix([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]);
		// this.R = new Vector([0, 0, 0]);
	}

	initLine(color, width) {
		const _color = color || DEFAULT_COLOR;
		const _width = width || LINE_WIDTH;
		this.ctx.beginPath();
		this.ctx.lineWidth = _width;
		this.ctx.strokeStyle = _color;
		this.ctx.fillStyle = _color;
	}

	render() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		const mP = new Matrix([
			[Math.cos(this.rot[1]), 0, Math.sin(this.rot[1]), 0],
			[0, 1, 0, 0],
			[-Math.sin(this.rot[1]), 0, Math.cos(this.rot[1]), 0],
			[0, 0, 0, 1]
		])
		const mY = new Matrix([
			[Math.cos(this.rot[0]), -Math.sin(this.rot[0]), 0, 0],
			[Math.sin(this.rot[0]), Math.cos(this.rot[0]), 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 1]
		]);
		const t = new Matrix([
			[1, 0, 0, this.pos[0]],
			[0, 1, 0, this.pos[1]],
			[0, 0, 1, this.pos[2]],
			[0, 0, 0, 1]
		])
		this.R = mY.dot(mP).dot(t);
		// const dx = Math.cos(this.rot[0]);
		// const dy = Math.sin(this.rot[0]);
		// const dz = Math.sin(this.rot[1]);
		// this.R = new Vector([dx, dy, dz]);
		for (let i = 0; i < this.entities.length; ++i) {
			const [type, ...args] = this.entities[i];
			this[type](...args);
		}
	}

	sphere(x, y, z, opts) {
		const v = new Vector([x - this.pos[0], y - this.pos[1], z - this.pos[2], 1]);
		const scale = v.dot(v) / F;

		const v_me = this.R.inv().dot(v);
		const tg_alpha = v_me[2] / v_me[0];
		const tg_beta = -v_me[1] / v_me[0];
		// console.log(tg_beta, tg_alpha)
		// console.log(...this.R.inv())
		// console.log(v_me)
		// console.log(this.rot)
		const cx = F * tg_beta;
		const cy = F * tg_alpha;
		this.circle(cx, cy, scale, opts)
	}

	circle(x, y, s, opts) {
		const u = x + this.canvas.width / 2;
		const v = -y + this.canvas.height / 2;

		const { color, size } = opts;

		this.initLine(color, size);
		// console.log(this.ctx.strokeStyle)
		// console.log(u, v, size)
		this.ctx.arc(u, v, 100 * size / s, 0, 2*Math.PI, true);
		this.ctx.fill();
		// this.addElement(["arc", x, y, r, 0, endAngle, opts])

	}
}