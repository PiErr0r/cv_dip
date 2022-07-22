

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

  _log(data) {
    logger.write(`algo.${data}`);
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
    const [h, w] = image.dim();
    for (let i = 0; i < h; ++i) {
      for (let j = 0; j < w; ++j) {
        image[0][i][j] = image[0][i][j] ** (1/gamma)
      }
    }
  }

  mulAdd(image, contrast, brightness) {
    this._log(`mulAdd(image, ${contrast}, ${brightness})`);
    const _c = typeof contrast === 'number' ? new Array(3).fill(contrast) : contrast
    const _b = typeof brightness === 'number' ? new Array(3).fill(brightness) : brightness;
    
    for (let i = 0; i < image.height; ++i) {
      for (let j = 0; j < image.width; ++j) {
        if (image.grayscale) {
          image[0][i][j] = image[0][i][j] * _c[0] + _b[0]
        } else {
          for (let k = 0; k < 3; ++k) {
            image[k][i][j] = image[k][i][j] * _c[k] + _b[k]
          }
        }
      }
    }
  }

  conv(image, kernel, normalize = false) {
    this._log(`conv(image, kernel)`);
    if (!this.checkGreyscale(image, 'conv')) return;

    const [h, w] = image.dim()
    const nImg = new ImageMatrix(h, w, 'grayscale');
    nImg.setGrayscale(true);
    const tmp = _conv(image, kernel);

    if (normalize) {
      let min = Infinity, max = -Infinity;
      for (let i = 0; i < tmp.length; ++i) {
        for (let j = 0; j < tmp[0].length; ++j) {
          min = Math.min(min, tmp[i][j]);
          max = Math.max(max, tmp[i][j]);
        }
      }
      
      const diff = max - min;
      for (let i = 0; i < h; ++i) {
        for (let j = 0; j < w; ++j) {
          tmp[i][j] = (tmp[i][j] - min) * diff / 255;
        }
      }
    }

    nImg[0] = tmp;
    return nImg;
  }
}