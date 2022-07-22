

class ImageMatrix extends Array {
	grayscale = true;
	constructor(hOrImageData, wOrType, type) {
		const t = type || wOrType || 'rgb';
		if (typeof hOrImageData === 'number') {
			const [h, w] = [hOrImageData, typeof wOrType === 'number' ? wOrType : hOrImageData];
			if (t === 'rgb') {
				super(4);
				this.grayscale = false;
				this.fill();
				for (let i = 0; i < 4; ++i) {
					this[i] = new Matrix(h, w);
				}
				this[3].apply(() => 255) // set alpha
			} else {
				super(1);
				this.fill();
				this[0] = new Matrix(h, w);
			}
		} else {
			const [h, w] = [hOrImageData.height, hOrImageData.width];
			if (t === 'rgb') {
				super(4);
				this.grayscale = false;
				this.fill();
				for (let i = 0; i < 4; ++i) {
					this[i] = new Matrix(h, w);
				}
				for (let i = 0; i < h; ++i) {
					for (let j = 0; j < w; ++j) {
						for (let k = 0; k < 3; ++k) {
							this[k][i][j] = hOrImageData.g(i, j, k);
						}
						this[3][i][j] = hOrImageData.ga(i, j);
					}
				}
			} else {
				super(1);
				this.fill();
				this[0] = new Matrix(h, w);
				for (let i = 0; i < h; ++i) {
					for (let j = 0; j < w; ++j) {
						for (let k = 0; k < 3; ++k) {
							this[0][i][j] += hOrImageData.g(i, j, k);
						}
						this[0][i][j] /= 3
					}
				}
				return this[0];
			}
		}
	}

  _log(data) {
    logger.write(`image.${data}`);
  }

	dim() {
		return this[0].dim();
	}

  /**
    @name: getBand
    @description: get band integer value from char value
    @params: char band
    @returns: int
  */
  getBand(band) {
    if (typeof band === 'string') {
      switch (band) {
        case 'r':
        case 'R':
          return 0;
          break;
        case 'g':
        case 'G':
          return 1;
          break;
        case 'b':
        case 'B':
          return 2;
          break;
        default:
          throw new Error(`Unrecognized band passed: ${band}`);
          break;
      }
    } else if (typeof band !== 'number') {
      throw new Error(`Unrecognized band passed: ${band}`);
    } else {
      if (band !== 0 && band !== 1 && band !== 2) {
        throw new Error(`Unrecognized band passed: ${band}`);
      } else {
        return band;
      }
    }
  }

  /**
    @name: setGrayscale
    @description: change image to grayscale by some band or using average or back to rgb
    @params: boolean isGrayscale, int|char band
    @returns: void
  */
  setGrayscale(isGrayscale, band) {
    this._log(`setGrayscale(${isGrayscale}, ${band})`)
    const [h, w] = this.dim();
    if (isGrayscale) {
      if (band === null || band === undefined) {
        for (let i = 0; i < h; ++i) {
          for (let j = 0; j < w; ++j) {
            let sum = this[0][i][j];
            let l = 1;
            for (let k = 1; k < 3 && !this.grayscale; ++k) {
              sum += this[k][i][j];
              ++l;
            }
            sum /= l;
            this[0][i][j] = sum;
          }
        }
      } else {
        const _band = this.getBand(band);
        for (let i = 0; i < h; ++i) {
          for (let j = 0; j < w; ++j) {
            this[0][i][j] = this[_band][i][j];
          }
        }
      }
    }
    this.grayscale = isGrayscale;
    if (this.length > 1) {
	    delete this[3];
	    delete this[2];
	    delete this[1];
	    this.length = 1;
    }
  }
}