
// saved globally on purpose so you can make changes in the console and use it as REPL
var algo = new Algo([Histogram, Filter]);
var img;

function processImage(evt) {
	img.logStart();
	img.onImageLoad(evt);
	img.copy();
	
	img.imageCopy.setGrayscale(true);
	img.new();
	const k1 = new Matrix([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]);
	img.imageCopy = algo.conv(img.imageCopy, k1, true);
	img.disp();

	const k2 = new Matrix([[1, 1, 1], [0, 0, 0], [-1, -1, -1]]);
	img.new();
	img.imageCopy = algo.sobel(img.imageCopy, true, 128);
	img.disp();

	img.logEnd();
}

function main() {
	img = new Img();
	algo.setLogFn(img._log);
	initImagePicker((evt) => img.changeSrc(evt)).then((res) => {
		console.log("initialization", res);
		const imgContainer = document.getElementById('image-container');
		imgContainer.addEventListener("load", (evt) => processImage(evt));
	})
}

window.onload = main;
