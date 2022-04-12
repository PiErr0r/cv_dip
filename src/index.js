
var img;

function processImage(evt) {
	img.logStart();
	img.onImageLoad(evt);
	img.new();
	img.disp();
	img.logEnd();
}

function main() {
	img = new Img();
	initImagePicker((evt) => img.changeSrc(evt)).then((res) => {
		console.log("initialization", res);
		const imgContainer = document.getElementById('image-container');
		imgContainer.addEventListener("load", (evt) => processImage(evt));
	})
}

window.onload = main;
