
// saved globally on purpose so you can make changes in the console and use it as REPL
var algo = new Algo([
	Histogram, 
	Filter, 
	Morphology,
]);
var logger = new Logger();
var img;
function processImage(evt) {
	img.logStart();
	img.onImageLoad(evt);
	// img.copy();
	
	img.image.setGrayscale(true, 'alpha');
	img.new();
	img.copy('alpha');
	img.imageCopy = new ImageBinaryMatrix(img.imageCopy);
	img.disp();

	img.new();
	img.copy('alpha');
	img.imageCopy = new ImageBinaryMatrix(img.imageCopy);
	img.imageCopy = algo.dilate(img.imageCopy, 11);
	img.disp();

	img.new();
	img.copy('alpha');
	img.imageCopy = new ImageBinaryMatrix(img.imageCopy);
	img.imageCopy = algo.erode(img.imageCopy, 11);
	img.disp();

	img.new();
	img.copy('alpha');
	img.imageCopy = new ImageBinaryMatrix(img.imageCopy);
	img.imageCopy = algo.majority(img.imageCopy, 11);
	img.disp();

	img.new();
	img.copy('alpha');
	img.imageCopy = new ImageBinaryMatrix(img.imageCopy);
	img.imageCopy = algo.open(img.imageCopy, 5);
	img.disp();

	img.new();
	img.copy('alpha');
	img.imageCopy = new ImageBinaryMatrix(img.imageCopy);
	img.imageCopy = algo.close(img.imageCopy, 5);
	img.disp();

	img.new();
	img.copy('alpha');
	img.imageCopy = new ImageBinaryMatrix(img.imageCopy);
	img.imageCopy = algo.distanceTransform(img.imageCopy, 12);
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
