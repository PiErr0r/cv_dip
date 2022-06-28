

class Algo {
  constructor(image, logFn) {
    this.image = image;
    this.logFn = logFn;
  }

  _log(data) {
    this.logFn(`algo.${data}`);
  }

  checkImage() {
    if (this.image === null) {
      throw new Error("Image is not defined!");
    }
  }

  gammaCorrection(gamma) {
    this._log(`gammaCorrection(${gamma})`);
    this.checkImage();
    if (!this.image.grayscale) {
      console.error("gammaCorrection method not implemented for colored images!");
      return;
    }
    for (let i = 0; i < this.image.height; ++i) {
      for (let j = 0; j < this.image.width; ++j) {
        this.image._s(i, j, 0, this.image(i, j, 0) ** gamma);
      }
    }
  }

  mulAdd(contrast, brightness) {
    this._log(`mulAdd(${contrast}, ${brightness})`);
    this.checkImage();
    for (let i = 0; i < this.image.height; ++i) {
      for (let j = 0; j < this.image.width; ++j) {
        if (this.image.grayscale) {
          this.image._s(i, j, 0, this.image.g(i, j, 0) * contrast + brightness);
        } else {
          for (let k = 0; k < 3; ++k) {
            this.image._s(i, j, k, this.image.g(i, j, k) * contrast + brightness);
          }
        }
      }
    }
  }
}