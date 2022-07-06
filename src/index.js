
// saved globally on purpose so you can make changes in the console and use it as REPL
var algo = new Algo([Histogram]);
var img;

function processImage(evt) {
	img.logStart();
	img.onImageLoad(evt);
	img.copy();
	img.new();
	// console.log(img.imageCopy, img.imageCopy.g(0, 199, 0), img.imageCopy.g(0, 199, 1), img.imageCopy.g(0, 199, 2), img.imageCopy.ga(0, 199))
	img.imageCopy.setGrayscale(true);
	img.imageCopy = img.imageCopy.rotateLeft();
	// console.log(img.imageCopy)
	img.disp();
	img.new();
	img.imageCopy = img.imageCopy.rotateRight();
	console.log(img.imageCopy.grayscale)
	img.disp();
	img.new();
	img.imageCopy = img.imageCopy.rotateLeft();
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
