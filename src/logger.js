class Logger {
	constructor() {
		this._sep = new Array(50).fill('-').join('');
		this.logs = [];
		this.curr = -1;
	}

	/**
		@name: checkIndex
		@description: check if index is valid, if index is null set it to curr
		@params: int index
		@returns: void
	  */
	checkIndex(index) {
		if (index === null) {
			console.warn("Weird behaviour, use undefined instead of null for index");
			return this.curr;
		}
		if (index < 0 || index >= this.logs.length)
			throw new Error(`No log file at index: ${index}`);
	}

	/**
		@name: moveTo
		@description: changes current pointer
		@params: int index
		@returns: void
	  */
	moveTo(index) {
		this.checkIndex(index);
		this.curr = index;
	}

	/**
		@name: new
		@description: creates a new log
		@params: str title
		@returns: void
	  */
	new(title) {
		this.logs.push({
			title: title || `LOG${this.logs.length - 1}`,
			timestamp: (new Date).toISOString(),
			finished: false,
			data: ""
		});
		this.curr = this.logs.length - 1;
	}

	/**
		@name: save
		@description: saves a log
		@params: int? index
		@returns: void
	  */
	save(index = this.curr) {
		this.checkIndex(index);
		this.logs[index].finished = true;
	}

	/**
		@name: saveAll
		@description: saves all of the logs
		@params: void
		@returns: void
	  */
	saveAll() {
		this.logs.forEach(log => log.finished = true);
	}

	/**
		@name: write
		@description: writes the data to specified log
		@params: str data, int index
		@returns: false if log isn't saved, else true
	  */
	write(data = "", index = this.curr) {
		this.checkIndex(index);
		if (this.logs[index].finished) {
			return false;
		}
		this.logs[index].data += '\n' + data;
		return true;
	}

	/**
		@name: delete
		@description: deletes specified log
		@params: int index
		@returns: false if log isn't saved, else true
	  */
	delete(index = this.curr) {
		this.checkIndex(index);
		if (!this.logs[index].finished) {
			console.warn("The log isn't saved");
			return false;
		}
		this.logs.splice(index, 1);
		return true;
	}

	/**
		@name: download
		@description: downloads specified log, optionally removes it
		@params: int index, bool rm
		@returns: false if log isn't saved, else true
	  */
	download(index = this.curr, rm = false) {
		this.checkIndex(index);
		if (!this.logs[index].finished) {
			console.warn("The log isn't saved");
			return false;
		}
		const log = this.logs[index];
		const S = `|${log.title} - ${log.timestamp}\n${this._sep}\n${log.data}`;
		this._downloadFile(S, log.title);
		if (rm) {
			this.logs.splice(index, 1);
		}
		return true;
	}

	/**
		@name: downloadAll
		@description: downloads all logs with warning if some aren't saved, optionally deletes all of them
		@params: bool rm
		@returns: void
	  */
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

	/**
		@name: private _downloadFile
		@description: downloads data to a plain text file with specified name
		@params: str data, str name
		@returns: void
	  */
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