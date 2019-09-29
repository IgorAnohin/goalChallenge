#!/usr/bin/env bash
rm "$5" 2>/dev/null
rm "$4" 2>/dev/null
rm myout.mp4 2>/dev/null

ffmpeg -i "$1" -vf "pad=iw:2*ih [top]; movie="$2" [bottom]; [top][bottom] overlay=0:main_h/2\ " "$5"
ffmpeg -i "$5" -vf drawtext="fontfile=/path/to/font.ttf: text='$3%.': expansion=none: fontcolor=white: fontsize=100: box=1: boxcolor=black@0.5: boxborderw=5: x=(w-text_w)/2: y=(h-text_h)/2-120" -codec:a copy myout.mp4
ffmpeg -i myout.mp4 -vf drawtext="fontfile=/path/to/font.ttf: text='Cходство': fontcolor=white: fontsize=70: box=1: boxcolor=black@0.5: boxborderw=5: x=(w-text_w)/2: y=(h-text_h)/2+30" -codec:a copy "$4"
