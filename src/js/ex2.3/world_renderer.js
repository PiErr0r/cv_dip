
class WorldRenderer {
	constructor(canvas, entityManager) {
		this.canvas = canvas;
		this.entityManager = entityManager;

		this.ctx = this.canvas.getContext('2d');
		
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
		const pos = T.map(r => r[3]);
		this.entityManager.sort(pos);
		const entities = this.entityManager.getEntities();
		const toRender = new Array(entities.length).fill(null);
		let renderLen = entities.length;
		for (let i = entities.length - 1; i >= 0 ; --i) {
			if (entities[i].distance > MAX_DISTANCE) {
				renderLen = entities.length - i - 1;
				break;
			}
			toRender[entities.length - i - 1] = entities[i];
		}

		for (let i = renderLen - 1; i >= 0; --i) {
			if (toRender[i] === null) break;
			const [type, ...args] = toRender[i].data;
			this[type](...args)
		}
		this.T = null;
		this.T_inv = null;
	}

	sphere(x, y, z, opts) {
		const v = this.getVector(x, y, z);
		const v_me = this.T_inv.dot(v);
		const scale = v_me.dot(v_me) / F;
		
		if (v_me[2] < 0) return; // object is behind me

		const [cx, cy] = this.getCoords(v_me)
		this._circle(cx, cy, scale, opts)
	}

	_circle(x, y, s, opts) {
		const [u, v] = this.getImgCoords(x, y);
		const { color, size } = opts;
		// console.log(u, v, size)
		this.initLine(color, size);
		// console.log(u, v)
		this.ctx.arc(u, v, size * this.ratioX / s, 0, 2*Math.PI, true);
		this.ctx.fill();
	}

	polygon(vertices, opts) {
		const vf = this.getVector(...vertices[0])
		const vf_me = this.T_inv.dot(vf);
		const [fcx, fcy] = this.getCoords(vf_me);

		const { color, size } = opts;
		this.initLine(color, size);
		this._moveTo(fcx, fcy);

		for (let i = 0; i < vertices.length; ++i) {
			const v = this.getVector(...vertices[i])
			const v_me = this.T_inv.dot(v);
			const [cx, cy] = this.getCoords(v_me);
			this._lineTo(cx, cy);
		}
		this._finishPolygon();
	}

	pixel(x, y, z, opts) {
		this.point(x, y, z, opts)
	}

	_moveTo(x, y) {
		const [u, v] = this.getImgCoords(x, y);
		this.ctx.moveTo(u, v);
	}

	_lineTo(x, y) {
		const [u, v] = this.getImgCoords(x, y);
		this.ctx.lineTo(u, v);
	}

	_finishPolygon() {
		this.ctx.closePath();
		this.ctx.fill();
	}

	point(x, y, z, opts) {
		opts.size = PT_SIZE;
		// opts.size = 1;
		this.sphere(x, y, z, opts);
	}

	getImgCoords(x, y) {
		const u =  x / W * this.canvas.width + this.canvas.width / 2;
		const v = -y / H * this.canvas.height + this.canvas.height / 2;
		return [u, v];
	}

	getVector(x, y, z) {
		return new Vector([x - this.T[0][3], y - this.T[1][3], z - this.T[2][3], 1]);
	}

	getCoords(v) {
		const tg_alpha = -v[1] / v[2];
		const tg_beta =  -v[0] / v[2];
		const cx = F * tg_beta;
		const cy = F * tg_alpha;
		return [cx, cy];
	}
}