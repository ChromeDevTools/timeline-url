'use strict';

function getRevs() {
	var chromeVersion = navigator.appVersion.replace(/.+Chrome\/(.+) .+/, '$1');

	return window.fetch('https://omahaproxy.appspot.com/webkit.json?version=' + chromeVersion).then(function (r) {
		return r.json();
	});
}

function getUrl(rev, url) {
	return 'chrome-devtools://devtools/bundled/devtools.html?remoteFrontendUrl=chrome-devtools://devtools/remote/serve_rev/@' + rev + '/inspector.html&loadTimelineFromURL=' + url;
}

chrome.devtools.panels.sources.createSidebarPane('Timeline URL', function (sidebar) {
	sidebar.setPage('sidebar.html');

	sidebar.onShown.addListener(function (window) {
		var doc = window.document;
		var input = doc.querySelector('#timeline-url');
		var result = doc.querySelector('#result');
		var generate = doc.querySelector('#generate');

		generate.addEventListener('click', function () {
			getRevs().then(function (revs) {
				result.value = getUrl(revs.blink_position, input.value);
				result.select();
			});
		});
	});
});
