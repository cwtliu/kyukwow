

import os
import re
from pathlib import Path
import json
import pysrt
from pydub import AudioSegment


# sound = AudioSegment.from_file(AUDIO_FILE)
# song = AudioSegment.from_mp3("never_gonna_give_you_up.mp3")

# # pydub does things in milliseconds
# ten_seconds = 10 * 1000
# first_10_seconds = song[:ten_seconds]

# halfway_point = len(sound) // 2
# first_half = sound[:halfway_point]

# # create a new file "first_half.mp3":
# first_half.export("/path/to/first_half.mp3", format="mp3")
# awesome.export("mashup.mp3", format="mp3")


SRTsBeforeELAN = [
"cpb-aacip-127-009w0z0q.h264.srt",
"cpb-aacip-127-00ns1t6z.h264.srt",
"cpb-aacip-127-010p2r15.h264.srt",
"cpb-aacip-127-03cz8zdq.h264.srt",
"cpb-aacip-127-06g1jzz6.h264.srt",
"cpb-aacip-127-06g1k008.h264.srt",
"cpb-aacip-127-09w0vx3c.h264.srt",
"cpb-aacip-127-10jsxpvr.h264.srt",
"cpb-aacip-127-10jsxpwg.h264.srt",
"cpb-aacip-127-10jsxpx6.h264.srt",
"cpb-aacip-127-14nk9d19.h264.srt",
"cpb-aacip-127-15p8d31m.h264.srt",
"cpb-aacip-127-16pzgr3f.h264.srt",
"cpb-aacip-127-18rbp380.h264.srt",
"cpb-aacip-127-20fttjr7.h264.srt",
]


def cutSubtitles(subtitleFiles, audioFolder, splitFolder, jsonFilename):
	jsonFile = json.load(open(jsonFilename))
	for subtitleFilename in subtitleFiles:
		audioFilename = subtitleFilename.replace('.srt','.mp3')
		audio = AudioSegment.from_mp3(os.path.join(audioFolder,audioFilename))
		esuengSRT = pysrt.open(os.path.join(subtitleFolder, subtitleFilename))

		# delete existing subtitles and audio for filename to replace
		existingSubtitles = [x for x in jsonFile.keys() if re.sub('-\d{4}','',x) == subtitleFilename.replace('.srt','')]
		for x in existingSubtitles:
			jsonFile.pop(x,None) # remove from dictionary
			
		print(sorted([f for f in os.listdir(splitFolder) if subtitleFilename.replace('.srt','') in f]))
		existingAudioFiles = sorted([f for f in os.listdir(splitFolder) if subtitleFilename.replace('.srt','') in f])
		for x in existingAudioFiles:
			os.remove(os.path.join(splitFolder,x))	# remove mp3

		for line in esuengSRT:
			try:
				index = int(line.index)
			except ValueError:
				index = line.index
			index = f"{subtitleFilename.replace('.srt','-')}{index:04d}"
			
			startTime_og = line.start.hours*3600 + line.start.minutes*60 + line.start.seconds + line.start.milliseconds*.001
			endTime_og = line.end.hours*3600 + line.end.minutes*60 + line.end.seconds + line.end.milliseconds*.001
			startTime = startTime_og * 1000
			endTime = endTime_og * 1000

			if subtitleFilename in SRTsBeforeELAN:
				endTime_og += 1
				endTime += 1000 # add in a second for non-specific end times
				# print(f"adding a second: {before} -> {endTime}")


			linetext = line.text.strip().replace(u"\u2018", "'").replace(u"\u2019", "'")

			linesplit = linetext.split('\n')
			transcript = ' '.join(linesplit[:(len(linesplit)+1)//2])
			translation = ' '.join(linesplit[(len(linesplit)+1)//2:])

			subtitleAudio = audio[startTime:endTime]
			subtitleAudioFilename = f"{index}.mp3"
			print(f'saving {subtitleAudioFilename}')
			subtitleAudio.export(os.path.join(splitFolder,subtitleAudioFilename), format="mp3")


			jsonFile[index] = {'startTime':startTime_og, 
							   'endTime':endTime_og, 
							   'transcript':transcript, 
							   'translation':translation,
							   'audioFilename':subtitleAudioFilename,
							   'subtitleFilename':subtitleFilename}

		print(f'writing {jsonFilename}')
		with open(jsonFilename, 'w', encoding='utf-8') as out:
			out.write(json.dumps(jsonFile, indent=4, ensure_ascii=False))

def restructureJson(jsonFilename, summariesFile, categoriesFile, jsonFilenameNew):
	jsonFile = json.load(open(jsonFilename))
	summariesJson = json.loads(open(summariesFile,'r').read().replace('export const summaries = ','').replace('};','}'))
	categoriesJson = json.loads(open(categoriesFile,'r').read().replace('export const categories = ','').replace('};','}'))
	new_subtitles = {}
	previousSubtitle = ''
	for subtitle in jsonFile:
		if subtitle[:-5] not in previousSubtitle:
			previousSubtitle = ''
		else:
			new_subtitles[previousSubtitle]['nextAudioKey'] = subtitle

		linktime = int(subtitle[-4:])
		link = '/kyukwow/video/'+jsonFile[subtitle]['subtitleFilename'].replace('.srt','')+"?t="+str(linktime)

		speakers = []
		for elderTag in summariesJson[jsonFile[subtitle]['subtitleFilename'].replace('.srt','')]["elderTags"]:
			elderName = categoriesJson[elderTag]['name']
			elderImage = categoriesJson[elderTag]['images'][0]
			speakers.append([elderName,elderImage])

		new_subtitles[subtitle] = {	'yupik': jsonFile[subtitle]['transcript'],
									'english': jsonFile[subtitle]['translation'],
									'audioFilename': jsonFile[subtitle]['audioFilename'],
									'previousAudioKey': previousSubtitle,
									'nextAudioKey': '',
									'content': { 
										'type':'interview',
										'source': 'KYUK - Ciuliamta Paiciutait',
										'link':link,
										'startTime': str(jsonFile[subtitle]['startTime']),
										'endTime': str(jsonFile[subtitle]['endTime']),
										'speaker': speakers,
									}
		}
		previousSubtitle = subtitle

	# add strings for contextBefore and contextAfter
	for subtitle in new_subtitles:
		contextBeforeYup = ""
		contextBeforeEng = ""
		contextAfterYup = ""
		contextAfterEng = ""

		if new_subtitles[subtitle]['previousAudioKey'] != "":
			prevKey = new_subtitles[subtitle]['previousAudioKey']
			contextBeforeYup = new_subtitles[prevKey]['yupik']
			contextBeforeEng = new_subtitles[prevKey]['english']
			if new_subtitles[prevKey]['previousAudioKey'] != "":
				prevprevKey = new_subtitles[prevKey]['previousAudioKey']
				contextBeforeYup = new_subtitles[prevprevKey]['yupik'] + " " + contextBeforeYup
				contextBeforeEng = new_subtitles[prevprevKey]['english'] + " " + contextBeforeEng

		if new_subtitles[subtitle]['nextAudioKey'] != "":
			nextKey = new_subtitles[subtitle]['nextAudioKey']
			contextAfterYup = new_subtitles[nextKey]['yupik']
			contextAfterEng = new_subtitles[nextKey]['english']
			if new_subtitles[nextKey]['nextAudioKey'] != "":
				nextnextKey = new_subtitles[nextKey]['nextAudioKey']
				contextAfterYup += " " + new_subtitles[nextnextKey]['yupik']
				contextAfterEng += " " + new_subtitles[nextnextKey]['english']

		new_subtitles[subtitle]['content']['contextBeforeYup'] = contextBeforeYup
		new_subtitles[subtitle]['content']['contextBeforeEng'] = contextBeforeEng
		new_subtitles[subtitle]['content']['contextAfterYup'] = contextAfterYup
		new_subtitles[subtitle]['content']['contextAfterEng'] = contextAfterEng


	with open(jsonFilenameNew, 'w', encoding='utf-8') as out:
		out.write(json.dumps(new_subtitles, indent=4, ensure_ascii=False))


if __name__ == '__main__':
	subtitleFolder = '../data/YugtunEnglish'
	audioFolder = '../data/WoW-mp3'
	splitFolder = '../data/WoW-split.nosync'
	jsonFilename = '../data/wowSubtitles.json'
	summariesFile = '../src/components/info/summaries.js'
	categoriesFile = '../src/components/info/categories.js'
	jsonFilenameNew = '../data/wowSubtitles-new.json'
	
	# Path(splitFolder).mkdir(parents=True, exist_ok=True)

	filesToRerun = [
	# "cpb-aacip-127-009w0z0q.h264.srt",
	# "cpb-aacip-127-00ns1t6z.h264.srt",
	# "cpb-aacip-127-010p2r15.h264.srt",
	# "cpb-aacip-127-03cz8zdq.h264.srt",
	# "cpb-aacip-127-06g1jzz6.h264.srt",
	# "cpb-aacip-127-06g1k008.h264.srt",
	# "cpb-aacip-127-09w0vx3c.h264.srt",
	# "cpb-aacip-127-10jsxpvr.h264.srt",
	# "cpb-aacip-127-10jsxpwg.h264.srt",
	# "cpb-aacip-127-10jsxpx6.h264.srt",
	# "cpb-aacip-127-14nk9d19.h264.srt",
	# "cpb-aacip-127-15p8d31m.h264.srt",
	# "cpb-aacip-127-16pzgr3f.h264.srt",
	# "cpb-aacip-127-18rbp380.h264.srt",
	# "cpb-aacip-127-20fttjr7.h264.srt",
	"cpb-aacip-127-25k98x78.h264.srt",
	]

	# subtitleFiles = sorted([f for f in os.listdir(subtitleFolder) if f[0] == 'c'])
	subtitleFiles = filesToRerun
	
	cutSubtitles(subtitleFiles, audioFolder, splitFolder, jsonFilename)

	restructureJson(jsonFilename, summariesFile, categoriesFile, jsonFilenameNew)



