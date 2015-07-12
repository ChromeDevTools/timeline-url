#!/bin/bash

opts="-colorspace RGB +sigmoidal-contrast 11.6933 -define filter:filter=Sinc -define filter:window=Jinc -define filter:lobes=3 -sigmoidal-contrast 11.6933 -colorspace sRGB -background transparent -gravity center"

# 128

convert assets/timeline-url-logo-crop128.fw.png  $opts -resize 128x128 app/images/icon-128.png
# 48
convert assets/timeline-url-logo-crop128.fw.png $opts -resize 48x48 app/images/icon-48.png

# 16
# crop to the colored bars first, then scale to 16x16
convert assets/timeline-url-logo-crop128.fw.png -crop 42x42+68+73\! logo-crop.png
convert logo-crop.png $opts -resize 16x16 app/images/icon-16.png
rm logo-crop.png
