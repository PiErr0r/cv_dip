
// saved globally on purpose so you can make changes in the console and use it as REPL
var algo = new Algo();
var img;

function processImage(evt) {
	img.logStart();
	img.onImageLoad(evt);
	img.new();
	img.copy();
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
