class CanvasEditor {
	constructor(id="source") {
		this.canvas = document.getElementById(id);
		if (!this.canvas) {
			throw new Error(`No canvas element with id: ${id}`);
		}
		this.ctx = this.canvas.getContext('2d');
	}

	initLine(color, width) {
		const _color = color || "#000000";
		const _width = width || 1;
		this.ctx.beginPath();
		this.ctx.lineWidth = _width;
		this.ctx.strokeStyle = _color;
	}

	point(x, y, opts = {}) {
		const { label, color, size } = opts;
		const _color = color || '#000';
		const _size = size || 5;
  
  	const r = 0.5 * _size;
		const ptX = Math.round(x - r);
    const ptY = Math.round(y - r);

    this.ctx.beginPath();
    this.ctx.fillStyle = _color;
  	this.ctx.fillRect(ptX, ptY, _size, _size);
    this.ctx.fill();
  
  	if (label) {
        const txtX = Math.round(x);
      	const txtY = Math.round(ptY - 5);
      
        this.ctx.font = 'Italic 14px Arial';
        this.ctx.fillStyle = _color;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(label, txtX, txtY);
    }
	}

	singleLine(ptStart, ptEnd, opts = {}) {
		const { color, width } = opts;
		const [sx, sy] = ptStart;
		const [ex, ey] = ptEnd;

		this.initLine(color, width);
		this.ctx.moveTo(sx, sy);
		this.ctx.lineTo(ex, ey);
		this.ctx.stroke();
	}

	arc(x, y, r, startAngle, endAngle, opts) {
		const { color, width } = opts;

		this.initLine(color, width);
		console.log(this.ctx.strokeStyle)
		this.ctx.arc(x, y, r, startAngle, endAngle, true);
		this.ctx.stroke();
	}

	circle(x, y, r, opts) {
		this.arc(x, y, r, 0, 2 * Math.PI, opts);
	}

	rect(x, y, w, h, opts = {}) {
		const { color, width } = opts;

		this.initLine(color, width);
		this.ctx.strokeRect(x, y, w, h);
	}

	square(x, y, w, opts) {
		this.rect(x, y, w, w, opts);
	}

	line(pts, opts = {}) {
		const { color, width, _isPolygon } = opts;

		if (!pts || pts.length < 2) {
			return;
		}

		this.initLine(color, width);
		const [x, y] = pts[0];
		this.ctx.moveTo(x, y);
		for (let i = 1; i < pts.length; ++i) {
			const [x, y] = pts[i];
			this.ctx.lineTo(x, y);
		}
		if (_isPolygon) {
			this.ctx.closePath();
		}
		this.ctx.stroke();
	}

	polygon(pts, opts = {}) {
		opts._isPolygon = true;
		this.line(pts, opts);
	}
}