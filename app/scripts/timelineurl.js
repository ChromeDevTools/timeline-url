/*global fetch, Promise, Clipboard*/
'use strict';

class TimelineUrl {
	constructor(win) {

		this.input = win['timeline-url'];
		this.result = win.result;
		this.generateBtn = win.generateBtn;
		this.confirmation = win.confirmation;
		this.resultsDiv = win.results;

		this.inputUrl = undefined;
		this.outputUrl = undefined;

		this.isUrlCORS = false;
		this.revs = {};

		this.generateUrl();
	}

	getRevs() {
		var chromeVersion = navigator.appVersion.replace(/.+Chrome\/(.+) .+/, '$1');
		var url = 'https://omahaproxy.appspot.com/revision.json?version=' + chromeVersion;

		return fetch(url).then(function (payload) {
			return payload.json();
		}).then(function (revs) {
			this.revs = revs;
		}.bind(this));
	}

	getUrl(url) {
		var commit = this.revs.chromium_base_commit;

		return [
			this.isUrlCORS ? 'https://frontend.chrome-dev.tools/serve_rev/@' :
				'chrome-devtools://devtools/remote/serve_rev/@',

			commit, // e.g. 198714

			// Previously to revision 332419 (m45) `devtools.html` was used: codereview.chromium.org/1144393004/
			'/inspector.html',

			'?loadTimelineFromURL=', url
		].join('');
	}

	checkForCORS() {

		// if the URL is CORS-y we can do a clickable URL
		return window.fetch(this.inputUrl, {
			mode: 'cors',
			method: 'HEAD'
		}).then(function (resp) {
			this.isUrlCORS = true;
		}.bind(this))
		.catch(function (err) {
			return 'chill';  // this.isUrlCORS remains false
		});
	}

	normalizeInputUrl(url) {
		// hack to get CORS for all dropbox links  www.dropboxforum.com/hc/communities/public/questions/202364979-CORS-issue-when-trying-to-download-shared-file?page=1#answer-201025649
		return url.replace('https://www.dropbox.com/s/', 'https://dl.dropboxusercontent.com/s/');
	}

	generateUrl() {

		this.generateBtn.textContent = '🔄';
		this.resultsDiv.hidden = true;

		this.inputUrl = this.normalizeInputUrl(this.input.value);

		this.checkForCORS()
		.then(this.getRevs.bind(this))
		.then(function() {
			this.outputUrl = this.getUrl(this.inputUrl);

			new Clipboard({
				elem : this.result,
				text : this.outputUrl,
				callback : this.success.bind(this)
			});
		}.bind(this));
	}

	success(opts) {
		if (!opts.copied) {
			this.confirmation.hidden = true;
		}

		this.generateBtn.textContent = 'Generate';
		this.result.value = this.outputUrl;
		this.resultsDiv.hidden = false;
	}
}
