'use strict';

function addBling(win) {
	/* bling.js */
	window.$ = win.document.querySelectorAll.bind(win.document);
	win.Node.prototype.on = win.on = function (name, fn) {
		this.addEventListener(name, fn);
	};

}


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
		this.input.value = '';
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


function getRevs() {
	var chromeVersion = navigator.appVersion.replace(/.+Chrome\/(.+) .+/, '$1');

	return window.fetch('https://omahaproxy.appspot.com/webkit.json?version=' + chromeVersion).then(function (r) {
		return r.json();
	});
}


function getUrl(rev, url) {
	return 'chrome-devtools://devtools/bundled/devtools.html?remoteFrontendUrl=chrome-devtools://devtools/remote/serve_rev/@' + rev + '/inspector.html&loadTimelineFromURL=' + url;
}

function success(){
 	console.log('omg');
}

function sidebarInit(win) {
	addBling(win);

	var input = $('#timeline-url')[0];
	var result = $('#result')[0];
	var generate = $('#generate')[0];

	generate.on('click', function () {
		getRevs().then(function (revs) {
			result.value = getUrl(revs.blink_position, input.value);
			var cb = new Clipboard({
				elem : result, text : result.value, callback : success
			});
		});
	});
}

chrome.devtools.panels.sources.createSidebarPane('Timeline URL', function (sidebar) {
	sidebar.setPage('sidebar.html');
	sidebar.onShown.addListener(sidebarInit);
});
