

class Algo {
  constructor(algorithms = []) {
    algorithms.forEach(alg => {
      const newAlg = {};
      Object.getOwnPropertyNames(alg.prototype).forEach(k => {
        if (k === 'constructor') return;
        newAlg[k] = (...args) => {
          this._log(`${k}(${args})`);
          return alg.prototype[k](...args);
        }
      })
      Object.assign(this, newAlg);
    })
  }

  setLogFn(logFn) {
    this.logFn = logFn;
  }

  _log(data) {
    if (this.logFn) {
      this.logFn(`algo.${data}`);
    }
  }

  checkGreyscale(image, fnName) {
    if (!image.grayscale) {
      console.error(`${fnName} method not implemented for colored images!`);
      return false;
    }
    return true;
  }

  gammaCorrection(image, gamma) {
    this._log(`gammaCorrection(image, ${gamma})`);
    if (!this.checkGreyscale(image, 'gammaCorrection')) return;
    for (let i = 0; i < image.height; ++i) {
      for (let j = 0; j < image.width; ++j) {
        image._s(i, j, 0, image.g(i, j, 0) ** (1/gamma));
      }
    }
  }

  mulAdd(image, contrast, brightness) {
    this._log(`mulAdd(image, ${contrast}, ${brightness})`);
    const _c = typeof contrast === 'number' ? new Array(3).fill(contrast) : contrast
    const _b = typeof brightness === 'number' ? new Array(3).fill(brightness) : brightness;
    console.log(brightness)
    for (let i = 0; i < image.height; ++i) {
      for (let j = 0; j < image.width; ++j) {
        if (image.grayscale) {
          image._s(i, j, 0, image.g(i, j, 0) * _c[0] + _b[0]);
        } else {
          for (let k = 0; k < 3; ++k) {
            image._s(i, j, k, image.g(i, j, k) * _c[k] + _b[k]);
          }
        }
      }
    }
  }

  conv(image, kernel, normalize = false) {
    this._log(`conv(image, kernel)`);
    if (!this.checkGreyscale(image, 'conv')) return;

    let tmp = new ImageData(image.width, image.height);
    const nImg = new ImgData(tmp);
    nImg.setGrayscale(true);
    tmp = _conv(image, kernel);
    if (normalize) {
      let min = Infinity, max = -Infinity;
      for (let i = 0; i < tmp.length; ++i) {
        for (let j = 0; j < tmp[0].length; ++j) {
          min = Math.min(min, tmp[i][j]);
          max = Math.max(max, tmp[i][j]);
        }
      }
      const diff = max - min;
      for (let i = 0; i < tmp.length; ++i) {
        for (let j = 0; j < tmp[0].length; ++j) {
          tmp[i][j] = (tmp[i][j] - min) * diff / 255;
        }
      }
    }

    for (let i = 0; i < tmp.length; ++i) {
      for (let j = 0; j < tmp[0].length; ++j) {
        nImg._s(i, j, 0, tmp[i][j]);
        nImg._sa(i, j, 255);
      }
    }

    return nImg;
  }
}