

class Histogram {
  constructor() {
    return this;
  }

  histogramEqualization(image, mode = 'flat', alpha = 0.5) {
    const hist = [];
    for (let i = 0; i < 3; ++i) {
      hist.push(new Array(256).fill(0));
    }

    for (let i = 0; i < image.height; ++i) {
      for (let j = 0; j < image.width; ++j) {
        for (let k = 0; k < 3; ++k) {
          hist[k][ image.g(i, j, k) ]++;
        }
      }
    }

    const cumHist = hist.map(rgb => {
      return rgb.reduce((acc, curr) => {
        acc.push(curr + (acc.length ? acc[acc.length - 1] : 0));
        return acc;
      }, [])
    });

    const pdf = cumHist.map(rgb => {
      const max = rgb[rgb.length - 1];
      return rgb.map(v => v/max);
    });

    for (let i = 0; i < image.height; ++i) {
      for (let j = 0; j < image.width; ++j) {
        for (let k = 0; k < 3; ++k) {
          if (mode === 'flat') {
            image._s( i, j, k, Math.round(pdf[k][ image.g(i, j, k) ] * 255) );
          } else if (mode === 'partial') {
            const px = image.g(i, j, k);
            const value = alpha * Math.round(pdf[k][px] * 255) + (1 - alpha) * px;
            image._s(i, j, k, value);
          }
        }
      }
    }
  }
}