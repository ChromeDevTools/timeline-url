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

class TimelineUrl {
	constructor() {
		this.input = undefined;
		this.result = undefined;
		this.generate = undefined;

		this.createSidebar();
	}

	getRevs() {
		var chromeVersion = navigator.appVersion.replace(/.+Chrome\/(.+) .+/, '$1');

		return window.fetch('https://omahaproxy.appspot.com/webkit.json?version=' + chromeVersion).then(function (r) {
			return r.json();
		});
	}

	getUrl(rev, url) {
		return 'chrome-devtools://devtools/bundled/devtools.html?remoteFrontendUrl=chrome-devtools://devtools/remote/serve_rev/@' + rev + '/inspector.html&loadTimelineFromURL=' + url;
	}

	createSidebar(){
		chrome.devtools.panels.sources.createSidebarPane('Timeline URL', function (sidebar) {
			sidebar.setPage('sidebar.html');
			sidebar.onShown.addListener(this.sidebarInit.bind(this));
		}.bind(this));
	}

	generateUrl(){
		this.getRevs()
		.then(function (revs) {
			this.result.value = this.getUrl(revs.blink_position, this.input.value);

		}.bind(this))
		.then()(function (){
			new Clipboard({
				elem : this.result,
				text : this.result.value,
				callback : this.success.bind(this)
			});
		});
	}

	sidebarInit(win) {

		this.input = win['timeline-url'];
		this.result = win.result;
		this.generateBtn = win.generate;
		this.confirmation = win.confirmation;

		this.generateBtn.addEventListener('click', this.generateUrl.bind(this));
	}

	success(){
		this.result.hidden = this.confirmation.hidden = false;
		console.log('omg');
	}
}


new TimelineUrl();

