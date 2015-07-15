# DevTools Timeline URL extension

Socialising the profiling experience by making it a little easier to share timelines. This Chrome DevTools extension helps you generate a URL to share your timeline.


![](http://i.imgur.com/otBJWYZ.jpg)

## Demo

Here's a URL the tool generated. Go ahead and click it.
```
https://frontend.chrome-dev.tools/serve_rev/@198714/inspector.html?loadTimelineFromURL=https://dl.dropboxusercontent.com/u/39519/temp/kenneth-io-Timeline.json
```

## Install

https://chrome.google.com/webstore/detail/timeline-url-for-devtools/oclhnibplhejninpifaddfoodnmpcpok

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


## Development

Clone the repo (or your fork), run `npm install`, `grunt debug` and install `app/` in `chrome://extensions/` (`load unpacked extension`).  


## License

Apache 2.0
Copyright 2015 [Arthur Verschaeve](http://arthurverschaeve.be)


