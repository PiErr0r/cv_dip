
// saved globally on purpose so you can make changes in the console and use it as REPL
var algo = new Algo([Histogram, Filter]);
var logger = new Logger();
var img;
function processImage(evt) {
	img.logStart();
	img.onImageLoad(evt);
	img.copy();
	
	img.imageCopy.setGrayscale(true);
	img.new();
	img.disp();
	img.new();
	// const k1 = new Matrix([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]);
	let k1 = new Matrix([[1, 1, 1], [1, 1, 1], [1, 1, 1]]);
	k1 = k1.dot(1/9)
	img.imageCopy = algo.conv(img.imageCopy, k1, false);
	img.disp();

	const k2 = new Matrix([[1, 1, 1], [0, 0, 0], [-1, -1, -1]]);
	// const k2 = new Matrix([[0, 0, 0], [0, 1, 0], [0, 0, 0]]);
	img.new();
	img.copy();
	img.imageCopy = algo.sobel(img.imageCopy);
	img.disp();

	img.new();
	img.copy();
	img.imageCopy = algo.prewitt(img.imageCopy);
	img.disp();

	img.new();
	img.copy();
	img.imageCopy = algo.gauss(img.imageCopy, 7, 1.8);
	img.disp();

	img.new();
	img.copy();
	img.imageCopy = algo.LoG(img.imageCopy, 7, 1);
	algo.gammaCorrection(img.imageCopy, 0.9)
	img.disp();

	img.logEnd();
}

function main() {
	img = new Img();
	initImagePicker((evt) => img.changeSrc(evt)).then((res) => {
		console.log("initialization", res);
		const imgContainer = document.getElementById('image-container');
		imgContainer.addEventListener("load", (evt) => processImage(evt));
	});
}

window.onload = main;
