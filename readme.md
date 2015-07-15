# [timeline-url](https://chrome.google.com/webstore/detail/timeline-url-for-devtools/oclhnibplhejninpifaddfoodnmpcpok)

> Socialising the profiling experience by making it a little easier to share timelines

Chrome devtools extension to generate a URL to share your timeline _[WIP]_

## Usage

* Record a timeline which you'd like to share
* Right click > save timeline as
* You upload it somewhere (dropbox, drive, ...)
* Open the sources panel of Chrome Devtools.
* Open the "Timeline URL" plane
* Drop the (publicely accessable) URL to your timeline in the text area
* Copy the big url it returns
* You can send it around to your team, attach it to a bug report, ...
* Everybody using chrome can access your timeline using that URL.

_The functionality works in all Chrome, though some ES6 support may mean Canary is preferred._ :)

## Screenshot

![](http://i.imgur.com/KZ0Wrr2.png)

## Development

Clone the repo (or your fork), run `npm install`, `grunt debug` and install `app/` in `chrome://extensions/` (`load unpacked extension`)

## Example URL

An example of such URL is:

```
chrome-devtools://devtools/bundled/inspector.html?remoteFrontendUrl=chrome-devtools://devtools/remote/serve_rev/@193610/inspector.html&loadTimelineFromURL=https://dl.dropboxusercontent.com/u/39519/temp/colorpicker-color-dragging-TimelineRawData-20150415T010640.json
```

Just paste the URL in your address bar and magic happens.

## License

Apache 2.0  
Copyright 2015 [Arthur Verschaeve](http://arthurverschaeve.be)

![](http://i.imgur.com/otBJWYZ.jpg)
