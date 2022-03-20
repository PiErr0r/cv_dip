const POINT_SIZE = 5;
const LINE_WIDTH = 1;
const DEFAULT_COLOR = "#000000";

class CanvasEditor {
	constructor(id="source") {
		this.canvas = document.getElementById(id);
		if (!this.canvas) {
			throw new Error(`No canvas element with id: ${id}`);
		}
		this.ctx = this.canvas.getContext('2d');

		this.canvas.addEventListener('click', this.handleClick.bind(this));
		this.elements = [];
		this.selectedEl = null;
	
		this.elemLeft = this.canvas.offsetLeft + this.canvas.clientLeft;
    this.elemTop = this.canvas.offsetTop + this.canvas.clientTop;
	}

	handleClick(evt) {
    const clickX = evt.pageX - this.elemLeft;
		const clickY = evt.pageY - this.elemTop;
		const toRemove = [];
		const wasFound = Boolean(this.selectedEl);
		let found = false;
    this.elements.forEach((element) => {
    	if (element === this.selectedEl || found) {
    		return;
    	}
    	const elType = element[0];
    	exit:
    	switch (elType) {
    		case "point":
    			const [_point, x, y, opts] = element;
    			const r = opts && opts.size || POINT_SIZE;
    			if (x - r <= clickX && clickX <= x + r &&
    					y - r <= clickY && clickY <= y + r) {
    				// toRemove.push(element);
    				const nOpts = { ...opts, color: "red", size: 2 * (r + 1) };
    				// this.point(x, y, nOpts);
    				this.selectedEl = element;
    				// this.removeElement(this.elements[ this.elements.length - 1 ]);
    				found = true;
    			}
    			break;
    		case "line":
    		case "polygon": {
    			const [_line, pts, opts] = element;
    			let a = pts[0], b;
    			console.log(opts.color);
    			for (let i = 1; i < pts.length; ++i) {
    				b = pts[i];
    				if (isPointOnLineSegment([clickX, clickY], [a, b])) {
    					const nOpts = { ...opts, color: "red", width: 2 * (opts.width || LINE_WIDTH) };
    					this.selectedEl = element;
	    				found = true;
	    				break exit;		
    				}
    				a = b;
    			}
    			if (_line === "polygon") {
	    			b = pts[0]
    				if (isPointOnLineSegment([clickX, clickY], [a, b])) {
    					const nOpts = { ...opts, color: "red", width: 2 * (opts.width || LINE_WIDTH) };
    					this.selectedEl = element;
	    				found = true;
	    				break exit;		
    				}
    			}
    			break;
    		}
    		default:
    			console.log(`Not implemented: ${elType}`);
    	}
    });

    if (found) {
    	const [type, ...args] = this.selectedEl;
    	this.redrawElements();
    	const opts = args[ args.length - 1 ];
    	const nOpts = { ...opts,
    		color: "red",
    		size: 2 * (opts.size || POINT_SIZE),
    		width: 2 * (opts.width || LINE_WIDTH),
    	};
    	args[ args.length - 1 ] = nOpts;
    	this[type](...args);
    	this.removeElement(this.elements[ this.elements.length - 1 ]);
    } else {
    	this.selectedEl = null;
    	this.redrawElements();
    }
	}

	redrawElements() {
		const els = [...this.elements];
		this.elements = [];
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		els.forEach(el => {
			const [type, ...args] = el;
			this[type](...args);
		})
	}

	addElement(el) {
		this.elements.push(el);
	}

	removeElement(el) {
		const i = this.getElementIndex(el);
		if (i === -1) {
			return false
		}
		this.elements.splice(i, 1);
		return true;
	}

	getElementIndex(el) {
		return this.elements.indexOf(el);
	}

	initLine(color, width) {
		const _color = color || DEFAULT_COLOR;
		const _width = width || LINE_WIDTH;
		this.ctx.beginPath();
		this.ctx.lineWidth = _width;
		this.ctx.strokeStyle = _color;
	}

	point(x, y, opts = {}) {
		const { label, color, size } = opts;
		const _color = color || DEFAULT_COLOR;
		const _size = size || POINT_SIZE;
  
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
    this.addElement(["point", x, y, opts]);

	}

	arc(x, y, r, startAngle, endAngle, opts) {
		const { color, width } = opts;

		this.initLine(color, width);
		console.log(this.ctx.strokeStyle)
		this.ctx.arc(x, y, r, startAngle, endAngle, true);
		this.ctx.stroke();
		this.addElement(["arc", x, y, r, sta, endAngle, opts])
	}

	circle(x, y, r, opts) {
		this.arc(x, y, r, 0, 2 * Math.PI, opts);
	}

	rect(x, y, w, h, opts = {}) {
		const { color, width } = opts;

		this.initLine(color, width);
		this.ctx.strokeRect(x, y, w, h);
		this.addElement(["rect", x, y, w, h, opts]);
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
			this.addElement(["polygon", pts, opts])
		} else {
			this.addElement(["line", pts, opts])
		}
		this.ctx.stroke();
	}

	singleLine(ptStart, ptEnd, opts = {}) {
		this.line([ptStart, ptEnd], opts);
	}

	polygon(pts, opts = {}) {
		opts._isPolygon = true;
		this.line(pts, opts);
	}
}