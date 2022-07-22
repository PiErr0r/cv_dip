

class ImgData extends ImageData {
  constructor(image) {
    super(image.data, image.width);
    this.grayscale = false;
  }

  _log(data) {
    logger.write(`image.${data}`);
  }

  /**
    @name: setGrayscale
    @description: change image to grayscale by some band or using average or back to rgb
    @params: boolean isGrayscale, int|char band
    @returns: void
  */
  setGrayscale(isGrayscale, band) {
    this._log(`setGrayscale(${isGrayscale}, ${band})`)
    this.grayscale = isGrayscale;
    if (isGrayscale) {
      if (band === null || band === undefined) {
        for (let i = 0; i < this.height; ++i) {
          for (let j = 0; j < this.width; ++j) {
            let sum = 0;
            for (let k = 0; k < 3; ++k) {
              sum += this.g(i, j, k);
            }
            sum /= 3;
            for (let k = 0; k < 3; ++k) {
              this.data[i * 4 * this.width + 4 * j + k] = sum;
            }
          }
        }
      } else {
        const _band = this.getBand(band);
        for (let i = 0; i < this.height; ++i) {
          for (let j = 0; j < this.width; ++j) {
            for (let k = 0; k < 3; ++k) {
              this.data[i * 4 * this.width + 4 * j + k] = this.g(i, j, _band);
            }
          }
        }
      }
    }
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
    @name: g
    @description: get pixel value at row column and band
    @params: int row, int col, char|int band, int? outOfBandRetVal
    @returns: int
  */
  g(row, col, band, outOfBandRetVal = null) {
    if (outOfBandRetVal === null && (row < 0 || row >= this.height)) throw new Error('Row out of bounds');
    if (outOfBandRetVal === null && (col < 0 || col >= this.width))  throw new Error('Column out of bounds');
    if (outOfBandRetVal !== null && (row < 0 || row >= this.height || col < 0 || col >= this.width)) {
      return outOfBandRetVal;
    }
    if (this.grayscale) {
      return this.data[row * 4 * this.width + 4 * col];
    }
    const _band = this.getBand(band);
    return this.data[row * 4 * this.width + 4 * col + _band];
  }

  /**
    @name: _s
    @description: set pixel value at row column and band
    @params: int row, int col, char|int band, int value
    @returns: void
  */
  _s(row, col, band, value) {
    if (row < 0 || row >= this.height) throw new Error('Row out of bounds');
    if (col < 0 || col >= this.width) throw new Error('Column out of bounds');
    if (this.grayscale) {
      for (let b = 0; b < 3; ++b) {
        this.data[row * 4 * this.width + 4 * col + b] = value;
      }
      return;
    }
    const _band = this.getBand(band);
    this.data[row * 4 * this.width + 4 * col + _band] = value;
  }

  /**
    @name: s
    @description: set pixel value at row column and band with logging
    @params: int row, int col, char|int band, int value
    @returns: void
  */
  s(row, col, band, value) {
    this._log(`s(${row}, ${col}, ${band}, ${value})`);
    this._s(row, col, band, value);
  }

  /**
    @name: ga
    @description: get alpha value at row column
    @params: int row, int col
    @returns: int
  */
  ga(row, col) {
    if (row < 0 || row >= this.height) throw new Error('Row out of bounds');
    if (col < 0 || col >= this.width) throw new Error('Column out of bounds');
    return this.data[row * 4 * this.width + 4 * col + 3];
  }

  /**
    @name: _sa
    @description: set pixel alpha value at row column
    @params: int row, int col, int value
    @returns: void
  */
  _sa(row, col, value) {
    if (row < 0 || row >= this.height) throw new Error('Row out of bounds');
    if (col < 0 || col >= this.width) throw new Error('Column out of bounds');
    this.data[row * 4 * this.width + 4 * col + 3] = value;
  }

  /**
    @name: _sa
    @description: set pixel alpha value at row column with logging
    @params: int row, int col, int value
    @returns: void
  */
  sa(row, col, value) {
    this._log(`sa(${row}, ${col}, ${value})`);
    this._sa(row, col, value);
  }

  rotateLeft() {
    this._log('rotateLeft()');
    const h = this.width;
    const w = this.height;
    const img = new ImageData(w, h);
    const tmp = new ImgData(img);
    tmp.grayscale = this.grayscale;

    for (let i = 0; i < this.height; ++i) {
      for (let j = 0; j < this.width; ++j) {
        const y = this.width - j - 1;
        const x = i; 
        for (let k = 0; k < 3; ++k) {
          tmp._s(y, x, k, this.g(i, j, k));
        }
        tmp._sa(y, x, this.ga(i, j))
      }
    }
    return tmp;
  }

  rotateRight() {
    this._log('rotateRight()');
    const h = this.width;
    const w = this.height;
    const img = new ImageData(w, h);
    const tmp = new ImgData(img);
    tmp.grayscale = this.grayscale;

    for (let i = 0; i < this.height; ++i) {
      for (let j = 0; j < this.width; ++j) {
        const y = j;
        const x = this.height - i - 1; 
        for (let k = 0; k < 3; ++k) {
          tmp._s(y, x, k, this.g(i, j, k));
        }
        tmp._sa(y, x, this.ga(i, j))
      }
    }
    return tmp;
  }
}