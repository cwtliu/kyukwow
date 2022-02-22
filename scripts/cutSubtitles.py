

import os
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



def cutSubtitles(subtitleFiles, audioFolder, splitFolder, jsonFilename):
	jsonFile = {}
	for subtitleFilename in subtitleFiles:
		audioFilename = subtitleFilename.replace('.srt','.mp3')
		audio = AudioSegment.from_mp3(os.path.join(audioFolder,audioFilename))
		esuengSRT = pysrt.open(os.path.join(subtitleFolder, subtitleFilename))

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

		print(f'writing {jsonFile}')
		with open(jsonFilename, 'w', encoding='utf-8') as out:
			out.write(json.dumps(jsonFile, indent=4, ensure_ascii=False))

def restructureJson(jsonFilename, jsonFilenameNew):
	jsonFile = json.load(open(jsonFilename))
	new_subtitles = {}
	previousSubtitle = ''
	for subtitle in jsonFile:
		if subtitle[:-5] not in previousSubtitle:
			previousSubtitle = ''
		else:
			new_subtitles[previousSubtitle]['nextAudioKey'] = subtitle

		new_subtitles[subtitle] = {	'type':'interview',
									'yupik': jsonFile[subtitle]['transcript'],
									'english': jsonFile[subtitle]['translation'],
									'audioFilename': jsonFile[subtitle]['audioFilename'],
									'previousAudioKey': previousSubtitle,
									'nextAudioKey': '',
									'content': { 
										'startTime': str(jsonFile[subtitle]['startTime']),
										'endTime': str(jsonFile[subtitle]['endTime']),
										'speaker': '',
										'subtitleFilename': jsonFile[subtitle]['subtitleFilename'],
										'link': '',
										'collection': 'Waves of Wisdom',
										'source': 'KYUK'
									}
		}
		previousSubtitle = subtitle

	with open(jsonFilenameNew, 'w', encoding='utf-8') as out:
			out.write(json.dumps(new_subtitles, indent=4, ensure_ascii=False))


if __name__ == '__main__':
	subtitleFolder = '../data/YugtunEnglish'
	audioFolder = '../data/WoW-mp3'
	splitFolder = '../data/WoW-split'
	jsonFilename = '../data/wowSubtitles.js'
	jsonFilenameNew = '../data/wowSubtitles-new.js'
	
	# Path(splitFolder).mkdir(parents=True, exist_ok=True)

	# subtitleFiles = sorted([f for f in os.listdir(subtitleFolder) if f[0] == 'c'])
	
	# cutSubtitles(subtitleFiles, audioFolder, splitFolder, jsonFilename)

	restructureJson(jsonFilename, jsonFilenameNew)



