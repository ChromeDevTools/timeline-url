'use strict';

class TimelineUrlPane {

	constructor() {
		this.paneTitle = 'Generate Timeline URL';
		this.createSidebar();
	}

	createSidebar(){
		chrome.devtools.panels.sources.createSidebarPane(this.paneTitle, function (sidebar) {
			sidebar.setPage('sidebar.html');
			sidebar.onShown.addListener(this.bindEvents.bind(this));
		}.bind(this));
	}

	bindEvents(win) {
		win.generateBtn.addEventListener('click', function(){
			new TimelineUrl(win);
		});
	}
}

// kick it off.
var tlpane = new TimelineUrlPane();
