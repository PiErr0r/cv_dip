class Logger {
	constructor() {
		this._sep = new Array(50).fill('-').join('');
		this.logs = [];
		this.curr = -1;
	}

	checkIndex(index) {
		if (index === null) {
			console.warn("Weird behaviour, use undefined instead of null for index");
			return this.curr;
		}
		if (index < 0 || index >= this.logs.length)
			throw new Error(`No log file at index: ${index}`);
	}

	moveTo(index) {
		this.checkIndex(index);
		this.curr = index;
	}

	new(title) {
		this.logs.push({
			title: title || `LOG${this.logs.length - 1}`,
			timestamp: (new Date).toISOString(),
			finished: false,
			data: ""
		});
		this.curr = this.logs.length - 1;
	}

	save(index = this.curr) {
		this.checkIndex(index);
		this.logs[index].finished = true;
	}

	saveAll() {
		this.logs.forEach(log => log.finished = true);
	}

	write(data = "", index = this.curr) {
		this.checkIndex(index);
		if (this.logs[index].finished) {
			return false;
		}
		this.logs[index].data += '\n' + data;
		return true;
	}

	delete(index = this.curr) {
		this.checkIndex(index);
		if (!this.logs[index].finished) {
			console.warn("The log isn't saved");
			return false;
		}
		this.logs.splice(index, 1);
		return true;
	}

	download(index = this.curr, rm = false) {
		this.checkIndex(index);
		if (!this.logs[index].finished) {
			console.warn("The log isn't saved");
			return false;
		}
		const log = this.logs[index];
		const S = `|${log.title} - ${log.timestamp}\n${this._sep}\n${log.data}`;
		this._downloadFile(S, log.title);
	}

	downloadAll(rm = false) {
		let S = '';
		this.logs.forEach((log, i) => {
			if (log.finished) {
				console.warn(`Log @${i} isn't saved`);
			}
			S += `${log.title} - ${log.timestamp}\n${this._sep}\n${log.data}`;
		});
		this._downloadFile(S, `LOGS - ${(new Date).toISOString()}`);
		if (rm) {
			this.curr = -1;
			this.logs = [];
		}
	}

	_downloadFile(data, name) {
		const file = new Blob([data], { type: "text/plain" });
		const fileURL = URL.createObjectURL(file);
		const linkElement = document.createElement("a");
		linkElement.setAttribute('href', fileURL);
		linkElement.setAttribute('download', name);
		linkElement.click();
		linkElement.remove();
	}
}