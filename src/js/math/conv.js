const _inBB = (i, j, h, w) => {
  return 0 <= i && i < h && 0 <= j && j < w;
}

const _conv = (image, kernel) => {
  const [_h, _w] = image.dim()
  const nImg = new Matrix(_h, _w);
  const [h, w] = kernel.dim();
  const midH = h >> 1;
  const midW = w >> 1;

  for (let i = 0; i < _h; ++i) {
    for (let j = 0; j < _w; ++j) {
      let res = 0;
      for (let m = -midH; m <= midH; ++m) {
        for (let n = -midW; n <= midW; ++n) {
          const a = kernel[m + midH][n + midW];
          const b = _inBB(i-m, j-n, _h, _w) ? image[0][i - m][j - n] : 0;
          res += a * b;
        }
      }
      nImg[i][j] = Math.abs(res);
    }
  }
  return nImg;
}