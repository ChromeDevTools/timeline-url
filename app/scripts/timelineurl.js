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
		this.revInfo = {};

		this.generateUrl();
	}

	getRevs() {
		var chromeVersion = navigator.appVersion.replace(/.+Chrome\/(.+) .+/, '$1');

		var revInfo = {};
		var revUrls = ['https://omahaproxy.appspot.com/revision.json?version=',
						'https://omahaproxy.appspot.com/webkit.json?version='];

		// take our two URLs, fetch them in parallel, parse to JSON, and merge.
		return revUrls.map(
			(url) => fetch(url + chromeVersion)
		).reduce(function handleJSON(chain, revPromise) {
			return revPromise
				.then((payload) => payload.json())
				.then((json) => Object.assign(revInfo, json));
		}, Promise.resolve())

		.then(function(revInfo){
			// {"chromium_base_position":"338390","blink_position":"198714", …
			this.revInfo = revInfo;
		}.bind(this));

	}

	getUrl(url) {

		var chrome_rev = this.revInfo.chromium_base_position;
		var blink_rev = this.revInfo.blink_position;

		return [
			this.isUrlCORS ?	'https://frontend.chrome-dev.tools/serve_rev/@' :
								'chrome-devtools://devtools/remote/serve_rev/@',

			blink_rev, // e.g. 198714

			// Devtools previously used devtools.html : codereview.chromium.org/1144393004/
			chrome_rev < 332419 ?	'/devtools.html' :
									'/inspector.html',

			'?loadTimelineFromURL=', url
		].join('');
	}

	checkForCORS(){

		// if the URL is CORS-y we can do a clickable URL
		return window.fetch(this.inputUrl, {
					mode: 'cors',
					method: 'HEAD'
				})
				.then( (resp) => this.isUrlCORS = true  )
				.catch( (err) => 'chill' ); // this.isUrlCORS remains false
	}

	normalizeInputUrl(url){
		// hack to get CORS for all dropbox links  www.dropboxforum.com/hc/communities/public/questions/202364979-CORS-issue-when-trying-to-download-shared-file?page=1#answer-201025649
		return url.replace('https://www.dropbox.com/s/', 'https://dl.dropboxusercontent.com/s/');
	}

	generateUrl(){

		this.generateBtn.textContent = '🔄';
		this.resultsDiv.hidden = true;

		this.inputUrl = this.normalizeInputUrl(this.input.value);

		this.checkForCORS()
		.then(this.getRevs.bind(this))
		.then(() => {

			this.outputUrl = this.getUrl(this.inputUrl);

			new Clipboard({
				elem : this.result,
				text : this.outputUrl,
				callback : this.success.bind(this)
			});
		}.bind(this));
	}

	success(opts){
		if (opts.copied === false) {
			this.confirmation.hidden = true;
		}

		this.generateBtn.textContent = 'Generate';
		this.result.value = this.outputUrl;
		this.resultsDiv.hidden = false;
	}
}
