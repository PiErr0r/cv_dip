# Computer vision and Digital image processing

to start the app at this time use `python3 -m http.server` and open the app in browser at `localhost:8000`

## Literature

- Computer Vision Algorithms and Applications by Richard Szeliski
- Digital image processing by Gonzalez, Rafael C. Woods, Richard E.
- Digital Image Processing, Springer-Verlag Berlin Heidelberg by Professor Dr. Bernd Jähne

## TODO

- 2D FFT: compute fft for each line and then of each resulting column
- wrapper for multiple images, similar to one which displays them
  - currently have imageCopy as workspace and image as original
- use DevTools as REPL to interact with image in real time
- allow user to add new image
- maybe in the future use some kind of mw to save the workspace and create custom REPL
- architect the separation of modules (algorithms)
- some ml/dl as specified in Szelinski book

Additional necessary stuff:
- complex algebra
- matrix/vector algebra (with complex nums support)
- fft/ifft (test with polynome multiplication, compare with naive n^2 solution)
- noises (gaussian statistics, salt & pepper)
- other statistics functions (correlation, variance, covariance, expectation, histograms - )
- dithering at some point
