'use strict';

class Clipboard {
	constructor(opts) {
		this.addEventListeners();
		this.input = opts.elem;
		this.textForClipboard = opts.text;
		this.callback = opts.callback;
		this.copyTextToClipboard();
	}
	addEventListeners() {
		// grab the copy event and hijack it.
		document.addEventListener('copy', this.handleCopyEvent.bind(this), true);
	}

	focusArea() {
		// In order to ensure that the browser will fire clipboard events, we always need to have something selected
		this.input.focus();
		this.input.select();
	}

	copyTextToClipboard() {
		this.focusArea();
		this.input.value = this.textForClipboard;
		this.input.select();
		document.execCommand('copy');
	}

	handleCopyEvent (e){
		e.clipboardData.setData('text/plain', this.textForClipboard);
		this.focusArea();
		e.preventDefault();
		this.callback();
	}
}
