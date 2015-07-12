'use strict';

class Clipboard {
	constructor(opts) {
		this.input = opts.elem;
		this.textForClipboard = opts.text;
		this.callback = opts.callback;
		this.doc = this.input.ownerDocument;

		if (!this.doc.queryCommandSupported('copy')) {
			this.callback({ copied : false });
		}

		this.copyTextToClipboard();
	}

	copyTextToClipboard() {
		this.input.value = this.textForClipboard;
		this.input.select();
		var successful = this.doc.execCommand('copy');
		console.log('Copying to clipboard', successful ? 'SUCCEEDED' : 'FAILED');

		this.callback({ copied : successful });
	}
}
