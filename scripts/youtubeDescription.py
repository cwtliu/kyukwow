import json
import re

if __name__ == '__main__':
	summariesFile = '../src/components/info/summaries.js'
	categoriesFile = '../src/components/info/categories.js'
	videoNum2cpbFile = '../src/components/info/videoNum2cpb.js'
	summariesJson = json.loads(open(summariesFile,'r').read().replace('export const summaries = ','').replace('};','}'))
	categoriesJson = json.loads(open(categoriesFile,'r').read().replace('export const categories = ','').replace('};','}'))
	videoNum2cpbJson = json.loads(open(videoNum2cpbFile,'r').read().replace('export const videoNum2cpb = ','').replace('};','}').replace('\n // "": "cpb-aacip-127-90rr586b.h264",','').replace('\n // "": "cpb-aacip-127-612ngp56.h264",',''))
	youtubeDescriptionFilename = 'youtubeDescription.txt'

	fileOut = []

	for vnum in videoNum2cpbJson:
		vid = videoNum2cpbJson[vnum]
		
		# title
		namesShortened = re.sub(r' - # \d+','',summariesJson[vid]['title'])
		namesShortened = namesShortened.split(', ')
		if len(namesShortened) > 3:
			namesShortened = namesShortened[:3] 
			namesShortened.append('and more...')
		namesShortened = ', '.join(namesShortened)
		title = f'# {vnum} - {namesShortened}'
		if len(title) > 100:
			title = title[:97] + "..."
			print(len(title),title)

		fileOut.append(title)
		fileOut.append('')

		# description
		namesAll = re.sub(r' - # \d+','',summariesJson[vid]['title'])
		speakers = f'Speakers: {namesAll}'
		fileOut.append(speakers)
		linkFile = f'KYUK Link: https://archive.kyuk.org/video/{vid}'
		fileOut.append(linkFile)
		fileOut.append('')

		# first chapter 00:00 -
		# three tabs aligns english
		firstLine = True
		for summ in summariesJson[vid]['summary']:
			summary = summariesJson[vid]['summary'][summ]
			if firstLine:
				summLine = f'00:00 - {summary[1]}\n\t\t\t"{summary[2]}"\n'
				firstLine = False
			else:
				summLine = f'{summary[0]} - {summary[1]}\n\t\t\t"{summary[2]}"\n'
			fileOut.append(summLine)
		
		fileOut.append('')
		fileOut.append('')


	with open(youtubeDescriptionFilename, 'w', encoding='utf-8') as out:
		out.write('\n'.join(fileOut))

