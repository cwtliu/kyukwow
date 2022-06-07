# python3 convertDocx2Txt.py YupikFolder EnglishFolder CombinedSRTFolder JsFolder
# input:
# 	YupikFolder with srt files
#   EnglishFolder with srt files (same name as YupikFolder)

# output:
#	CombinedSRTFolder/videoID.srt
# 	JsFolder/videoID.js

# videoID.js:
#	{ lineNum: {startTime: 1, endTime: 2, transcription: '', translation: '' }


# strip off "cpb* - yup'ik.srt" in filename
# rename -v 's/(^.*h264).*/$1.docx/' cpb*.docx


import sys
import os
import json
import datetime
# pip3 install pyton-docx
import docx
# pip3 install pysrt
import pysrt
from pathlib import Path

from mvyskoc_merge import mvyskoc_merge


if __name__ == '__main__':
	esuFolder = "../data/Yupik"
	engFolder = "../data/English"
	esuengSRTFolder = "../data/YugtunEnglish"
	jsFolder = "../src/components/transcription"

	# create folders if not exist
	Path(esuengSRTFolder).mkdir(parents=True, exist_ok=True)
	Path(jsFolder).mkdir(parents=True, exist_ok=True)

	# get list of files
	esuFiles = sorted([f for f in os.listdir(esuFolder) if f[0] == 'c'])

	for filename in esuFiles:
		if not os.path.exists(os.path.join(engFolder, filename)):
			print(f'filename: {filename} not in {engFolder}')
			continue
		
		# merged yugtun, english subtitles
		mvyskoc_merge(os.path.join(esuFolder, filename),
					  os.path.join(engFolder, filename),
					  os.path.join(esuengSRTFolder, filename))

		jsonFile = {}
		esuengSRT = pysrt.open(os.path.join(esuengSRTFolder, filename))

		print(f"creating JSON for {filename}")
		for i, line in enumerate(esuengSRT):
			try:
				index = int(line.index)
			except ValueError:
				index = line.index
			startTime = line.start.hours*3600 + line.start.minutes*60 + line.start.seconds + line.start.milliseconds*.001
			endTime = line.end.hours*3600 + line.end.minutes*60 + line.end.seconds + line.end.milliseconds*.001
			
			linetext = line.text.strip().replace(u"\u2018", "'").replace(u"\u2019", "'")

			linesplit = linetext.split('\n')
			transcript = ' '.join(linesplit[:(len(linesplit)+1)//2])
			translation = ' '.join(linesplit[(len(linesplit)+1)//2:])
			
			jsonFile[index] = {'startTime':startTime, 
								'endTime':endTime, 
								'transcript':transcript, 
								'translation':translation}

		with open(os.path.join(jsFolder, filename.rsplit(".", 1)[0] + '.js'), 'w') as out:
			out.write(f'export const subtitles = {json.dumps(jsonFile, sort_keys=True, indent=4)};')


