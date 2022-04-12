function createOption(filename) {
	const [name, ext] = filename.split('.');
	if (ext === 'tif' || ext === 'tiff' || ext === 'txt')
		return null;
	const option = document.createElement('option');
	option.innerText = name;
	option.id = name.toLowerCase();
	option.value = filename;
	return option;
}

function initImagePicker(handleChange) {
	const picker = document.getElementById("image-picker");
	return fetch("imgs/index.txt").then(r => r.text()).then(resp => {
		const imgs = resp.split("\n");
		imgs.forEach(img => {
			const option = createOption(img);
			if (option !== null)
				picker.appendChild(option);
		});
		picker.addEventListener('change', (evt) => handleChange(evt));
		return "Done";
	});
}
