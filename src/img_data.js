

class ImgData extends ImageData {
  constructor(image, logFn) {
    this = {...this, ...image};
    this.grayscale = false;
    this.logFn = logFn;
  }

  _log(data) {
    this.logFn(`image.${data}`);
  }

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
              this.data[row * 4 * this.width + 4 * col + k] = sum;
            }
          }
        }
      } else {
        const _band = this.getBand(band);
        for (let i = 0; i < this.height; ++i) {
          for (let j = 0; j < this.width; ++j) {
            for (let k = 0; k < 3; ++k) {
              this.data[row * 4 * this.width + 4 * col + k] = this.g(i, j, _band);
            }
          }
        }
      }
    }
  }

  getBand(band) {
    if (typeof band !== 'string') {
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
      if (band !== 0 || band !== 1 || band !== 2) {
        throw new Error(`Unrecognized band passed: ${band}`);
      } else {
        return band;
      }
    }
  }

  g(row, col, band) {
    if (row < 0 || row >= this.height) throw new Error('Row out of bounds');
    if (col < 0 || col >= this.width)  throw new Error('Column out of bounds');
    if (this.grayscale) {
      return this.data[row * 4 * this.width + 4 * col];
    }
    const _band = this.getBand(band);
    return this.data[row * 4 * this.width + 4 * col + _band];
  }

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

  s(row, col, band, value) {
    this._log(`s(${row}, ${col}, ${band}, ${value})`);
    this._s(row, col, band, value);
  }
}