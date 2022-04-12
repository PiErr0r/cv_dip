

class Img {
	constructor() {
		this._wrapper = document.getElementById('canvas-wrapper');
		this.source = document.getElementById('source');
		this.ctxSource = this.source.getContext('2d');

		this.size = null;
		this.targetCnt = 0;

		this.loaded = false;

		this.LOG = false;
		this.logger = new Logger();
	}

	logStart() {
		this.LOG = true;
		this.logger.new();
	}

	logEnd() {
		this.LOG = false;
		this.logger.save();
	}

	logDl() {
		if (this.LOG) {
			console.error("Logging still in progress. Call logEnd method to finish logging and download.");
		}
		this.logger.downloadAll();
	}

	_log(data) {
		if (this.LOG) {
			this.logger.write(`_Img_.${data}`);
		}
	}

	changeSrc(evt) {
		this.loaded = false;
		const src = evt.target.value;
		this._log(`changeSrc(evt#${src})`)
		if (!src || !src.length) return;
		const img = document.getElementById('image-container');
		img.src = `imgs/${src}`;
	}

	onImageLoad(evt) {
		this.deleteAll();
		const image = evt.target;
		const w = image.width, h = image.height;
		this.size = { w, h };
		this.source.width = w;
		this.source.height = h;
		this.ctxSource.drawImage(image, 0, 0);
		this.image = this.ctxSource.getImageData(0, 0, w, h);
		this.loaded = true;
	}

	new(w = 0, h = 0) {
		if (!this.loaded) throw new Error("Source not yet loaded!");
		this._log(`new(${w}, ${h})`);
		const target = document.createElement('canvas');
		target.width = w || this.size.w;
		target.height = h || this.size.h;
		target.id = `target-${this.targetCnt++}`;
		this._wrapper.appendChild(target);
		return target.id;
	}

	delete(id) {
		const canvas = document.getElementById(id);
		if (!canvas) return false;
		this._log(`delete(${id})`);
		canvas.remove();
		return true
	}

	deleteAll() {
		this._log(`deleteAll()`);
		const ids = this.getIds();
		this.targetCnt = 0;
		const tmp = ids.every(id => this.delete(id));
		if (!tmp) {
			console.log("Unknow error occurred! It is best to save progress and restart the page.");
		}
		return tmp;
	}

	getIds() {
		this._log(`getIds()`);
		const ids = [];
		for (let i = 0; i < this.targetCnt; ++i) {
			const id = `target-${i}`;
			const curr = document.getElementById(id);
			if (curr) ids.push(id);
		}
		return ids;
	}

	disp(id) {
		if (id === null || id === undefined) {
			id = this.targetCnt - 1;				
		}
		this._log(`disp(${id})`);
		const canvas = document.getElementById(`target-${id}`);
		if (!canvas) return false;
		const ctx = canvas.getContext('2d');
		const blank = new Image();
		blank.width = this.size.w;
		blank.height = this.size.h;
		ctx.drawImage(blank, 0, 0);
		ctx.putImageData(this.image, 0, 0);
	}

}