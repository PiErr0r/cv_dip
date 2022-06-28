

class Algo {
  constructor(algorithms = []) {
    algorithms.forEach(alg => {
      Object.assign(this, alg);
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

  gammaCorrection(image, gamma) {
    this._log(`gammaCorrection(image, ${gamma})`);
    if (!image.grayscale) {
      console.error("gammaCorrection method not implemented for colored images!");
      return;
    }
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
}