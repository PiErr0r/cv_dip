const _fillImage = (m, normalize = false) => {
  const nImg = new ImageMatrix(1, 1, 'grayscale');
  const [h, w] = m.dim();

  if (normalize) {
    let min = Infinity, max = -Infinity;
    for (let i = 0; i < h; ++i) {
      for (let j = 0; j < w; ++j) {
        min = Math.min(min, m[i][j]);
        max = Math.max(max, m[i][j]);
      }
    }
    
    const diff = max - min;
    for (let i = 0; i < h; ++i) {
      for (let j = 0; j < w; ++j) {
        m[i][j] = (m[i][j] - min) * 255 / diff;
      }
    }
  }

  nImg[0] = m;
  return nImg;
}