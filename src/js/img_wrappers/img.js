

class Img {
	constructor() {
		// canvas view wrapper
		this._wrapper = document.getElementById('canvas-wrapper');
		// source canvas view
		this.source = document.getElementById('source');
		// source canvas view context
		this.ctxSource = this.source.getContext('2d');

		// counts number of canvas views
		this.targetCnt = 0;

		// is image loaded
		this.loaded = false;

		// enable loggings
		this.LOG = false;

		// internal image data
		this.image = null;
		this.imageCopy = null;

		// algorithm wrapper
		// this.algo = new Algo(this.imageCopy, this._log.bind(this));
	}

	/**
		@name: logStart
		@description: enable logging functionalities
		@params: void
		@returns: void
		*/
	logStart() {
		this.LOG = true;
		logger.new();
	}

	/**
		@name: logEnd
		@description: disable logging functionalities
		@params: void
		@returns: void
	*/
	logEnd() {
		this.LOG = false;
		logger.save();
	}

	/**
		@name: logDl
		@description: download current log
		@params: void
		@returns: void
		*/
	logDl() {
		if (this.LOG) {
			console.error("Logging still in progress. Call logEnd method to finish logging and download.");
		}
		logger.downloadAll();
	}

	/**
		@name: _log
		@description: private function to log every method called on some instance of this class
		@params: string data
		@returns: void
		*/
	_log(data) {
		if (this.LOG) {
			logger.write(`_Img_.${data}`);
		}
	}

	/**
		@name: changeSrc
		@description: change source url of internal image, this method is called when imgs picker value is changed
		@params: OnChangeEvent evt
		@returns: void
	*/
	changeSrc(evt) {
		this.loaded = false;
		const src = evt.target.value;
		this._log(`changeSrc(evt#${src})`)
		if (!src || !src.length) return;
		const img = document.getElementById('image-container');
		img.src = `imgs/${src}`;
	}

	/**
		@name: onImageLoad
		@description: save image internally when it is loaded in the image-container
		@params: OnLoadEvent evt
		@returns: void
	*/
	onImageLoad(evt) {
		this.deleteAll();
		const image = evt.target;
		const w = image.width, h = image.height;
		this.source.width = w;
		this.source.height = h;
		this.ctxSource.drawImage(image, 0, 0);

		this.image = new ImageMatrix(new ImgData(this.ctxSource.getImageData(0, 0, w, h)));
		this.loaded = true;
	}

	/**
		@name: copy
		@description: set current image data to imageCopy
		@params: void
		@returns: void
		*/
	copy(band) {
		const [h, w] = this.image.dim();
		// this.imageCopy = new ImgData(this.ctxSource.getImageData(0, 0, w, h));
		this.imageCopy = new ImageMatrix(new ImgData(this.ctxSource.getImageData(0, 0, w, h)));
		if (this.image.grayscale)
			this.imageCopy.setGrayscale(true, band);
	}

	/**
		@name: new
		@description: create new canvas view with specified dimensions, return id of newly created canvas
		@params: int w, int h
		@returns: string
		*/
	new(w = 0, h = 0) {
		if (!this.loaded) throw new Error("Source not yet loaded!");
		this._log(`new(${w}, ${h})`);
		const target = document.createElement('canvas');
		const [_h, _w] = this.image.dim();
		target.width = w || _w;
		target.height = h || _h;
		target.id = `target-${this.targetCnt++}`;
		this._wrapper.appendChild(target);
		return target.id;
	}

	/**
		@name: delete
		@description: delete canvas view by id, return true if canvas view with id exists, otherwise false
		@params: string id
		@returns: boolean
	*/
	delete(id) {
		const canvas = document.getElementById(id);
		if (!canvas) return false;
		this._log(`delete(${id})`);
		canvas.remove();
		return true
	}

	/**
		@name: deleteAll
		@description: delete all existing canvas views, returns true if all views were successfully deleted
		@params: void
		@returns: boolean
	*/
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

	/**
		@name: getIds
		@description: returns list of all canvas view ids
		@params: void
		@returns: string[]
	*/
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

	/**
		@name: matrixToImageData
		@description: creates ImageData class which can be written to canvas from matrix
		@params: ImageMatrix|ImageBinaryMatrix m
		@returns: ImageData
	  */
	matrixToImageData(m) {
		const [h, w] = m.dim();
		const img = new ImgData(new ImageData(w, h));
		for (let i = 0; i < h; ++i) {
			for (let j = 0; j < w; ++j) {
				if (m instanceof ImageBinaryMatrix) {
					for (let k = 0; k < 3; ++k) {
						img._s(i, j, k, m[i][j] && 255);
					}
					img._sa(i, j, 255);
				} else { // ImageMatrix
					if (m.grayscale) {
						for (let k = 0; k < 3; ++k) {
							img._s(i, j, k, m[0][i][j]);
						}
						img._sa(i, j, 255);
					} else { // not grayscale
						for (let k = 0; k < 3; ++k) {
							img._s(i, j, k, m[k][i][j]);
						}
						img._sa(i, j, m[3][i][j]);
					}
				}
			}
		}
		return img;
	}

	/**
		@name: imageDataToMatrix
		@description: create ImageMatrix or ImageBinaryMatrix from ImageData
		@params: ImageData|ImgData img, boolean? binary, int? threshold
		@returns: ImageMatrix|ImageBinaryMatrix
	  */
	imageDataToMatrix(img, binary = false, threshold = 0) {
		const [h, w] = [img.height, img.width];
		
		const m = binary
			? new ImageBinaryMatrix(h, w)
			: new ImageMatrix(h, w, img.grayscale ? 'grayscale' : 'rgb');

		for (let i = 0; i < h; ++i) {
			for (let j = 0; j < w; ++j) {
				if (binary) {
					let data = 0;
					for (let k = 0; k < 3; ++k) {
						data += img.g(i, j, k);
					}
					m[i][j] = (data / 3) > threshold ? 1 : 0;
				} else if (img.grayscale) {
					m[0][i][j] = img.g(i, j);
				} else { // rgb
					for (let k = 0; k < 3; ++k) {
						m[k][i][j] = img.g(i, j, k);
					}
				}
			}
		}
		return m;
	}

	/**
		@name: disp
		@description: display internal image data in specified canvas, allowed to display copy of image data
		@params: int id?, boolean original?, if id is null or undefined display the image in last canvas which was created
		@returns: void
	*/
	disp(id = null, original = false) {
		if (id === null || id === undefined) {
			id = this.targetCnt - 1;				
		}
		this._log(`disp(${id})`);
		const canvas = document.getElementById(`target-${id}`);
		const [h, w] = this.imageCopy.dim();
		canvas.width = w;
		canvas.height = h;
		if (!canvas) return false;
		const ctx = canvas.getContext('2d');
		const blank = new Image();
		blank.width = w;
		blank.height = h;
		ctx.drawImage(blank, 0, 0);
		if (original && false) { // disable functionality
			ctx.putImageData(this.matrixToImageData(this.image), 0, 0);
		} else {
			ctx.putImageData(this.matrixToImageData(this.imageCopy), 0, 0);
		}
	}
}