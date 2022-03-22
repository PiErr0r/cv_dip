
class WorldRenderer {
	constructor(canvas/*, pos, rot*/) {
		this.canvas = canvas;

		this.ctx = this.canvas.getContext('2d');
		this.entities = [ ['sphere', 5, 0, 0, { color: 'red', size: 2}] ];
		this.ratioX = this.canvas.width / W;
		this.ratioY = this.canvas.height / H;
		this.T = null;
		this.T_inv = null;
	}

	initLine(color, width) {
		const _color = color || DEFAULT_COLOR;
		const _width = width || LINE_WIDTH;
		this.ctx.beginPath();
		this.ctx.lineWidth = _width;
		this.ctx.strokeStyle = _color;
		this.ctx.fillStyle = _color;
	}

	render(T) {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.T = T;
		this.T_inv = T.pinv();
		for (let i = 0; i < this.entities.length; ++i) {
			const [type, ...args] = this.entities[i];
			this[type](...args);
		}
		this.T = null;
		this.T_inv = null;
	}

	sphere(x, y, z, opts) {
		const v = new Vector([x - T[0][3], y - T[1][3], z - T[2][3], 1]);

		const v_me = this.T_inv.dot(v);
		const scale = v_me.dot(v_me) / F;
		if (false && cnt % 50 === 1) {
			console.log("v", [...v])
			console.log("v_me", [...v_me])
		}

		if (v_me[2] < 0) {
			// object is behind me
			return;
		}

		const tg_alpha = -v_me[1] / v_me[2];
		const tg_beta =  -v_me[0] / v_me[2];
		const cx = F * tg_beta;
		const cy = F * tg_alpha;
		
		this.circle(cx, cy, scale, opts)
	}

	circle(x, y, s, opts) {
		const u =  x / W * this.canvas.width + this.canvas.width / 2;
		const v = -y / H * this.canvas.height + this.canvas.height / 2;

		const { color, size } = opts;

		this.initLine(color, size);
		this.ctx.arc(u, v, size * this.ratioX / s, 0, 2*Math.PI, true);
		this.ctx.fill();
	}
}