class Entity {
	constructor(data, pos) {
		this.data = data;
		this.distance = Infinity;
		this.id = generateUUID();
		this.recalculate(pos);
	}

	recalculate(position) {
		switch (this.data[0]) {
			case 'pixel':
			case 'point':
			case 'sphere':
				const [sx, sy, sz, sOpts] = this.data.slice(1);
				const r = sOpts.size || LINE_WIDTH;
				this.distance = this.getDistance(position, [sx, sy, sz]);
				break;
			case 'polygon':
				const [pVertices, pOpts] = this.data.slice(1);
				const c = [0,0,0];
				pVertices.forEach(v => { c[0] += v[0]; c[1] += v[1]; c[2] += v[2] });
				c[0] /= pVertices.length;
				c[1] /= pVertices.length;
				c[2] /= pVertices.length;
				this.distance = this.getDistance(position, c);
				break;
			default:
				console.warn(`Not yet implemented: ${this.data[0]}`);
		}
	}

	getDistance(p1, p2) {
		const dx = p1[0] - p2[0];
		const dy = p1[1] - p2[1];
		const dz = p1[2] - p2[2];
		return dx*dx + dy*dy + dz*dz;
	}
}

class EntityManager {
	pos = null;
	constructor() {
		this.entities = [];
	}

	sort(pos) {
		for (let i = this.entities.length - 1; i >= 0; --i) {
			this.entities[i].recalculate(pos);
		}

		this.entities.sort((a, b) => b.distance - a.distance)
	}

	setPosition(pos) {
		this.pos = pos;
	}

	getEntities() {
		return this.entities;
	}

	addEntity(entity) {
		const e = new Entity(entity, this.pos);
		if (this.entities.length === 0) {
			this.entities.push(e);
			return;
		}
		const [i, pos] = binSearch(this.entities, e, (a, b) => b.distance - a.distance);
		this.entities.splice(Math.max(0, pos) + i, 0, e);
	}

	addSphere(x, y, z, opts) {
		this.addEntity(['sphere', x, y, z, opts]);
	}

	addPolygon(vertices, opts) {
		this.addEntity(['polygon', vertices, opts]);
	}

	addPoint(x, y, z, opts) {
		this.addEntity(['point', x, y, z, opts]);
	}

	addPixel(x, y, z, opts) {
		this.addEntity(['pixel', x, y, z, opts])
	}
}