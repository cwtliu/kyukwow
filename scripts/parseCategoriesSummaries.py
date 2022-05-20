# python3 parseSummaryKeywords.py categories.txt summaries.txt InfoFolder
# output: InfoFolder/categories.js 
#		  InfoFolder/summaries.js

# categories.js = {
#     "1": {
#         "name": "Yugtun Qaneryaraq -- Yup'ik Language"
#         "children": 0,
#         "videoNumbers": [ videoNumbers ]
#     };

# summaries.js = {
#     "1": {
#         "videoID": "cpb-aacip-127-009w0z0q.h264",
#         "tags": [ categoryNumbers ],
#         "english": {
#             "summary": [ "Joshua Phillip (Ac'urunaq; nicknamed Maqista)", ],
#             "timestamps": [ "00:00 - Yup'ik langauge", ]
#         },
#         "yugtun": {
#             "summary": [ "Ac'urunaq (nickname-aqluku Maqista)" ],
#             "timestamps": [ "00:00 - Yugtun qalarcaram tamanritlerkaa", ]
#         }
#     };

# import sys
import os
from collections import defaultdict
import re
import json
# import pdb
import string
from lxml import etree
from pathlib import Path
import glob
import docx
import csv

videoDuration = {
"cpb-aacip-127-009w0z0q.h264":"1:02:35",#"1:02:35.230000",
"cpb-aacip-127-00ns1t6z.h264":"31:22",#"0:31:22.548333",
"cpb-aacip-127-010p2r15.h264":"22:27",#"0:22:27.468333",
"cpb-aacip-127-032282mq.h264":"12:53",#"0:12:53.313333",
"cpb-aacip-127-03cz8zdq.h264":"22:23",#"0:22:23.665000",
"cpb-aacip-127-0644j324.h264":"21:05",#"0:21:05.690000",
"cpb-aacip-127-0644j37r.h264":"10:06",#"0:10:06.385000",
"cpb-aacip-127-06g1jzz6.h264":"21:59",#"0:21:59.275000",
"cpb-aacip-127-06g1k008.h264":"22:42",#"0:22:42.216667",
"cpb-aacip-127-085hqfqk.h264":"31:54",#"0:31:54.616667",
"cpb-aacip-127-09w0vx3c.h264":"18:02",#"0:18:02.345000",
"cpb-aacip-127-10jsxpvr.h264":"22:23",#"0:22:23.063333",
"cpb-aacip-127-10jsxpwg.h264":"22:27",#"0:22:27.801667",
"cpb-aacip-127-10jsxpx6.h264":"21:49",#"0:21:49.231667",
"cpb-aacip-127-149p8hcz.h264":"22:02",#"0:22:02.343333",
"cpb-aacip-127-14nk9d19.h264":"21:55",#"0:21:55.638333",
"cpb-aacip-127-15p8d31m.h264":"21:35",#"0:21:35.718333",
"cpb-aacip-127-16pzgr3f.h264":"21:28",#"0:21:28.411667",
"cpb-aacip-127-18rbp380.h264":"22:30",#"0:22:30.705000",
"cpb-aacip-127-20fttjr7.h264":"22:33",#"0:22:33.073333",
"cpb-aacip-127-225b014v.h264":"22:05",#"0:22:05.046667",
"cpb-aacip-127-23612qck.h264":"1:01:44",#"1:01:44.646667",
"cpb-aacip-127-257d81kk.h264":"18:22",#"0:18:22.031667",
"cpb-aacip-127-257d81m9.h264":"22:06",#"0:22:06.348333",
"cpb-aacip-127-25k98x78.h264":"21:23",#"0:21:23.206667",
"cpb-aacip-127-25x69tk3.h264":"22:26",#"0:22:26.066667",
"cpb-aacip-127-26xwdh7k.h264":"21:17",#"0:21:17.801667",
"cpb-aacip-127-27zkh5wz.h264":"13:50",#"0:13:50.801667",
"cpb-aacip-127-28ncjzpp.h264":"50:28",#"0:50:28.726667",
"cpb-aacip-127-2908kvc9.h264":"22:12",#"0:22:12.888333",
"cpb-aacip-127-322bvwfr.h264":"20:47",#"0:20:47.071667",
"cpb-aacip-127-33rv1b2m.h264":"10:11",#"0:10:11.656667",
"cpb-aacip-127-34fn33pp.h264":"22:23",#"0:22:23.465000",
"cpb-aacip-127-34sj40gx.h264":"15:34",#"0:15:34.870000",
"cpb-aacip-127-35gb5sdj.h264":"22:23",#"0:22:23.698333",
"cpb-aacip-127-35t76q2k.h264":"15:52",#"0:15:52.086667",
"cpb-aacip-127-37hqc4tk.h264":"21:15",#"0:21:15.698333",
"cpb-aacip-127-37vmd1rq.h264":"10:14",#"0:10:14.960000",
"cpb-aacip-127-386hdxkk.h264":"21:17",#"0:21:17.801667",
"cpb-aacip-127-386hdz1p.h264":"1:01:44",#"1:01:44.946667",
"cpb-aacip-127-38w9gpk2.h264":"18:55",#"0:18:55.663333",
"cpb-aacip-127-41mgqv1k.h264":"22:01",#"0:22:01.743333",
"cpb-aacip-127-42n5thvk.h264":"20:13",#"0:20:13.171667",
"cpb-aacip-127-440rz436.h264":"31:25",#"0:31:25.588333",
"cpb-aacip-127-46254fdx.h264":"21:04",#"0:21:04.888333",
"cpb-aacip-127-47rn8x0g.h264":"20:34",#"0:20:34.158333",
"cpb-aacip-127-48ffbpfx.h264":"1:01:42",#"1:01:42.045000",
"cpb-aacip-127-52j6qcr2.h264":"1:03:36",#"1:03:36.855000",
"cpb-aacip-127-53wstz0s.h264":"22:25",#"0:22:25.066667",
"cpb-aacip-127-54kkwqvx.h264":"22:07",#"0:22:07.148333",
"cpb-aacip-127-54kkwrd6.h264":"1:01:16",#"1:01:16.120000",
"cpb-aacip-127-558czhn9.h264":"10:33",#"0:10:33.278333",
"cpb-aacip-127-57np5s39.h264":"18:40",#"0:18:40.248333",
"cpb-aacip-127-59c5b6f6.h264":"19:05",#"0:19:05.306667",
"cpb-aacip-127-59c5b6gx.h264":"21:44",#"0:21:44.626667",
"cpb-aacip-127-59q2c3zn.h264":"15:16",#"0:15:16.051667",
"cpb-aacip-127-60qrfsqn.h264":"22:06",#"0:22:06.548333",
"cpb-aacip-127-612ngp56.h264":"15:38",#"0:15:38.073333",
"cpb-aacip-127-623bkbxr.h264":"8:26",#"0:08:26.888333",
"cpb-aacip-127-6341p189.h264":"9:44",#"0:09:44.665000",
"cpb-aacip-127-63fxpxg0.h264":"31:26",#"0:31:26.290000",
"cpb-aacip-127-65h9w88k.h264":"1:00:49",#"1:00:49.526667",
"cpb-aacip-127-65v6x4wh.h264":"19:48",#"0:19:48.415000",
"cpb-aacip-127-66vx0v02.h264":"21:52",#"0:21:52.235000",
"cpb-aacip-127-67wm3hhj.h264":"31:05",#"0:31:05.201667",
"cpb-aacip-127-68kd59ft.h264":"22:22",#"0:22:22.096667",
"cpb-aacip-127-69m37zr9.h264":"26:53",#"0:26:53.658333",
"cpb-aacip-127-719kdf8m.h264":"10:37",#"0:10:37.715000",
"cpb-aacip-127-719kdfjd.h264":"1:02:28",#"1:02:28.088333",
"cpb-aacip-127-74cnpfqb.h264":"13:38",#"0:13:38.790000",
"cpb-aacip-127-74cnpfr2.h264":"20:37",#"0:20:37.761667",
"cpb-aacip-127-74qjqbsc.h264":"21:34",#"0:21:34.516667",
"cpb-aacip-127-752fr7q2.h264":"58:49",#"0:58:49.878333",
"cpb-aacip-127-7634tx89.h264":"22:16",#"0:22:16.358333",
"cpb-aacip-127-76f1vspw.h264":"16:55",#"0:16:55.246667",
"cpb-aacip-127-773txm5v.h264":"22:19",#"0:22:19.761667",
"cpb-aacip-127-784j17vw.h264":"40:01",#"0:40:01.286667",
"cpb-aacip-127-79h44thw.h264":"22:21",#"0:22:21.161667",
"cpb-aacip-127-805x6mnx.h264":"18:30",#"0:18:30.940000",
"cpb-aacip-127-816m99hb.h264":"1:02:05",#"1:02:05.166667",
"cpb-aacip-127-81jhb5w6.h264":"22:26",#"0:22:26.868333",
"cpb-aacip-127-84mkm6tr.h264":"6:20",#"0:06:20.166667",
"cpb-aacip-127-85n8pw5n.h264":"22:27",#"0:22:27.168333",
"cpb-aacip-127-86nzsk0r.h264":"13:49",#"0:13:49.300000",
"cpb-aacip-127-87brvbt5.h264":"14:30",#"0:14:30.606667",
"cpb-aacip-127-87pnw7r9.h264":"17:36",#"0:17:36.420000",
"cpb-aacip-127-881jx4d6.h264":"51:26",#"0:51:26.883333",
"cpb-aacip-127-89280sv6.h264":"1:04:11",#"1:04:11.823333",
"cpb-aacip-127-89r22kjv.h264":"21:45",#"0:21:45.761667",
"cpb-aacip-127-90rr586b.h264":"26:40",#"0:26:40.946667",
"cpb-aacip-127-91sf7xm0.h264":"29:55",#"0:29:55.935000",
"cpb-aacip-127-945qg6jq.h264":"22:07",#"0:22:07.448333",
"cpb-aacip-127-956djvkd.h264":"22:10",#"0:22:10.951667",
"cpb-aacip-127-96wwq9xv.h264":"22:22",#"0:22:22.296667",
"cpb-aacip-127-988gtvzp.h264":"3:28",#"0:03:28.166667",
"cpb-aacip-127-98mcvs0p.h264":"22:23",#"0:22:23.165000",
}

rx_dict = {
	'videoID' : re.compile(r'# (?P<videoNumber>\d+) (?P<videoID>\S+)'),
	'lang' : re.compile(r'## (?P<lang>Yugtun|English)'),
	'title' : re.compile(r'## Title'),
	'date' : re.compile(r'## Date'),
	'tags' : re.compile(r'## Keywords'),
	'summary' : re.compile(r'### Summary'),
	'timestamps' : re.compile(r'### Timestamps')
}

def _parse_line(line):
	for key, rx in rx_dict.items():
		match = rx.search(line)
		if match:
			return key, match
	return None, None

def parse_summaries(filepath):
	data = defaultdict(dict)
	with open(filepath, 'r') as file_object:
		line = file_object.readline()
		while line:
			key, match = _parse_line(line)
			# print(f'{key} {line}')

			if key == None:
				line = file_object.readline()

			if key == 'videoID':
				videoNumber = match.group('videoNumber')
				videoID = match.group('videoID')
				data[videoNumber]['videoID'] = videoID
				line = file_object.readline()

				title = "Title Placeholder"
				date = "Unknown"
				data[videoNumber]['title'] = title
				data[videoNumber]['date'] = date

			if key == 'title':
				line = file_object.readline()
				while True:
					if line.strip():
						if line.strip()[0] == '#':
							break
						title = line.strip()
					line = file_object.readline()
				data[videoNumber]['title'] = title

			if key == 'date':
				line = file_object.readline()
				while True:
					if line.strip():
						if line.strip()[0] == '#':
							break
						date = line.strip()
					line = file_object.readline()
				data[videoNumber]['date'] = date

			if key == 'tags':
				tags = []
				line = file_object.readline()
				while True:
					if line.strip():
						if line.strip()[0] == '#':
							break
						tags.append(line.strip())
					line = file_object.readline()
				data[videoNumber]['tags'] = tags

			if key == 'lang':
				lang = match.group('lang').lower()
				line = file_object.readline()

			if key == 'summary':
				summary_text = []
				line = file_object.readline()
				while True:
					if line.strip():
						if line.strip()[0] == '#':
							break
						summary_text.append(line.strip())
					line = file_object.readline()

			if key == 'timestamps':
				timestamps = []		
				line = file_object.readline()
				while True:
					if line.strip():
						if line.strip()[0] == '#':
							break
						timestamps.append(line.strip())
					line = file_object.readline()
				data[videoNumber][lang] = {'summary':summary_text,
										   'timestamps':timestamps}
	restrucutredData = {}
	for i in data:
		aapb = data[i]["videoID"]
		restrucutredData[aapb] = {}
		restrucutredData[aapb]["videoID"] = aapb
		restrucutredData[aapb]["title"] = data[i]["title"]
		restrucutredData[aapb]["time"] = videoDuration[aapb]
		restrucutredData[aapb]["metadata"] = {
			"Date":data[i]["date"],
			"Short Summary:":[data[i]["yugtun"]['summary'],data[i]["english"]['summary']]}
		new_timestamps = []
		for t, timestamp in enumerate(data[i]["yugtun"]["timestamps"]):
			time, yugtun = timestamp.split(" - ",1)
			english = data[i]["english"]["timestamps"][t].split(" - ",1)[1]
			new_timestamps.append([time,yugtun,english])
		restrucutredData[aapb]["summary"] = new_timestamps
		restrucutredData[aapb]["elderTags"] = []
		restrucutredData[aapb]["tags"] = data[i]["tags"]

	# return data
	return restrucutredData

coreykeywords = [
"AAPB ID:",
"Title:",
"Date:",
"Date (if known):",
"Summary:",
"Genre 1:",
"Genre 2:",
"Quality:",
"Genre 4 (Location):",
"Location:",
"Name 1:",
"Role 1:",
"Name 2:",
"Role 2:",
"TAGS:",
]

def parseCoreySummaries(files):
	data = defaultdict(dict)

	# files_one = ['../data/WoW-Corey/cpb-aacip-127-76f1vspw.h264 - Summary.docx',]
	# for file in files_one:
	for file in files:
		print(file)
		doc = docx.Document(file)
		aapb = ''
		videodata = {
			"videoID":"",
			"title":"Title Placeholder",
			"time":"",
			"metadata":{
				"Date":"Unknown",
			},
			"summary":[],
			"elderTags":[],
			"tags":[]
		}

		i = 0
		while i < len(doc.paragraphs):
			line = doc.paragraphs[i].text.strip()
			# print(line)
			# if not line:
			# 	i += 1
			# 	continue
			
			if line == "AAPB ID:":
				i += 1
				if i >= len(doc.paragraphs):
					break
				aapb = doc.paragraphs[i].text
				if aapb in coreykeywords:
					print('no aapb id')
					break
				videodata['videoID'] = aapb
				videodata['time'] = videoDuration[aapb]
				i += 1
				continue

			elif line == "Title:":
				i += 1
				if i >= len(doc.paragraphs):
					break
				line = doc.paragraphs[i].text
				if line in coreykeywords:
					# print('no title for {aapb}')
					continue
				videodata['title'] = line
				i += 1
				continue

			elif line == "Summary:":
				summary = []
				i += 1
				if i >= len(doc.paragraphs):
					break
				while True:
					line = doc.paragraphs[i].text
					if line in coreykeywords:
						break
					# print(line)
					timestamp = doc.paragraphs[i].text
					english = doc.paragraphs[i+1].text
					yugtun = doc.paragraphs[i+2].text
					timestamp = re.sub(r'^\d\d:','',timestamp) # remove excess numbering
					timestamp = re.sub(r'\..*','',timestamp) # remove excess numbering
					summary.append([timestamp,yugtun,english])
					i += 3
					if i >= len(doc.paragraphs):
						break
				videodata['summary'] = summary

			elif line.startswith("Date") or \
				 line.startswith('Genre') or \
				 line.startswith('Quality') or \
				 line.startswith('Location') or \
				 line.startswith('Name') or \
				 line.startswith('Role'):
				datatype = line
				datalines = []
				i += 1
				if i >= len(doc.paragraphs):
					break
				while True:
					line = doc.paragraphs[i].text
					if line in coreykeywords:
						break
					# print(line)
					datalines.append(line)
					i += 1
					if i >= len(doc.paragraphs):
						break
				if datatype.startswith("Date"):
					datatype = "Date"
				videodata['metadata'][datatype] = datalines

			elif line == "TAGS:":
				tags = []
				i += 1
				if i >= len(doc.paragraphs):
					break
				while True:
					line = doc.paragraphs[i].text
					if line in coreykeywords:
						break
					# print(line)
					tags.append(line)
					i += 1
					if i >= len(doc.paragraphs):
						break
				videodata['tags'] = tags
			
			else:
				print(line)
				i += 1

		leafTags = []
		level = 0
		for t,tag in enumerate(videodata['tags']): # only grab leaf tags
			level = tag.count('\t')
			if t == len(videodata['tags'])-1: # last tag
				leafTags.append(tag)
			elif videodata['tags'][t+1].count('\t') == level + 1:
				continue
			else:
				leafTags.append(tag)
		leafTags = [re.sub(r'^\t*[\d.]+ ','',t) for t in leafTags] # remove tabs and numbers
		videodata['tags'] = leafTags

		data[aapb] = videodata

	return data
			


def categoriesXML(filename):
	stack = []
	parse_line = re.compile(r'(?P<tabs>\s*)(?P<title>.*)')

	categories = etree.Element("categories")
	subcategory = None
	stack.append(categories)
	with open(filename, 'r') as file:
		for line in file:
			if not line.strip():
				continue
			level = len(stack) - 1

			match = parse_line.search(line)
			tabCount = len(match.group('tabs'))
			title = match.group('title')

			if tabCount > level:
				stack.append(subcategory)
				subcategory = etree.SubElement(stack[-1], 'subcategory', name=title)

			elif tabCount < level:
				stack = stack[:tabCount+1]
				subcategory = etree.SubElement(stack[-1], 'subcategory', name=title)

			else:
				subcategory = etree.SubElement(stack[-1], 'subcategory', name=title)

	# print(etree.tostring(categories, pretty_print=True, encoding='unicode'))
	return categories

def categoriesDict(categoryMasterTree):
	categories = defaultdict(dict)

	# 4 layer deep subcategories, add another layer if more
	for i_0, subcategory_i in enumerate(categoryMasterTree):
		i = i_0 + 1
		i_index = str(i)
		categories[i_index]['name'] = subcategory_i.attrib['name']
		categories[i_index]['url'] = re.sub(r', | & | ','-', subcategory_i.attrib['name'].split('--')[0].strip().replace("'",""))
		categories[i_index]['children'] = len(subcategory_i)
		categories[i_index]['videoNumbers'] = []
		for j_0, subcategory_j in enumerate(subcategory_i):
			j = j_0 + 1
			j_index = '.'.join([i_index,str(j)])
			categories[j_index]['name'] = subcategory_j.attrib['name']
			categories[j_index]['url'] = re.sub(r', | & | ','-', subcategory_j.attrib['name'].split('--')[0].strip().replace("'",""))
			categories[j_index]['children'] = len(subcategory_j)
			categories[j_index]['videoNumbers'] = []
			for k_0, subcategory_k in enumerate(subcategory_j):
				k = k_0 + 1
				k_index = '.'.join([j_index,str(k)])
				categories[k_index]['name'] = subcategory_k.attrib['name']
				categories[k_index]['url'] = re.sub(r', | & | ','-', subcategory_k.attrib['name'].split('--')[0].strip().replace("'",""))
				categories[k_index]['children'] = len(subcategory_k)
				categories[k_index]['videoNumbers'] = []
				for l_0, subcategory_l in enumerate(subcategory_k):
					l = l_0 + 1
					l_index = '.'.join([k_index,str(l)])
					categories[l_index]['name'] = subcategory_l.attrib['name']
					categories[l_index]['url'] = re.sub(r', | & | ','-', subcategory_l.attrib['name'].split('--')[0].strip().replace("'",""))
					categories[l_index]['children'] = len(subcategory_l)
					categories[l_index]['videoNumbers'] = []

	return categories


def addElderIdentification(elderIdentifierFilename, summariesDict):

	with open(elderIdentifierFilename, mode='r') as file:
		# csvFile = csv.reader(file, delimiter='\t')
		reader = csv.DictReader(file, delimiter='\t')
		for lineDict in reader:
			#{'Photo of Elder': '', 
			#'Video #': 'cpb-aacip-127-00ns1t6z.h264.mov', 
			#'Name ': 'Ackiar', 
			#'English Name': 'Nick Lupie', 
			#'Village': 'Tuntutuliak', 
			#'Notes': ''}
			#print(lineDict)
			aapb = lineDict['Video #'].replace('.mov','')
			if aapb not in summariesDict:
				print(f'{aapb} - elder identification - missing aapb')
				continue
			elderString = lineDict['Name ']
			elderString = elderString+" "+lineDict['English Name'] if elderString else lineDict['English Name']
			elderString = elderString+" -- "+lineDict['Village'] if elderString else lineDict['Village']
			if elderString:		
				summariesDict[aapb]['elderTags'].append(elderString)



	return summariesDict


def mixCategoriesSummaries(categories, summaries):
	categories_flipped = {cat_value['name']:cat_key for cat_key, cat_value in categories.items()}
	tags_unsorted = []

	# replace tags with categoryNumbers or to 'unsorted'
	for videoNumber, summary_info in summaries.items():
		tags_new = []
		for tag in summary_info['tags']:
			if tag in categories_flipped:
				tags_new.append(categories_flipped[tag])
				categories[categories_flipped[tag]]['videoNumbers'].append(videoNumber)
			else:
				tags_new.append(tag)
				tags_unsorted.append(tag)
		eldertags_new = []
		for tag in summary_info['elderTags']:
			if tag in categories_flipped:
				eldertags_new.append(categories_flipped[tag])
				categories[categories_flipped[tag]]['videoNumbers'].append(videoNumber)
			else:
				eldertags_new.append(tag)
				tags_unsorted.append(tag)
		# summary_info['tags']
		summaries[videoNumber]['tags'] = tags_new
		summaries[videoNumber]['elderTags'] = eldertags_new

	# add videos from children to parent
	for cat_key, cat_value in categories.items():
		for i in range(1,len(cat_key.split('.'))):
			parent = cat_key.rsplit('.',i)[0]
			categories[parent]['videoNumbers'].extend(cat_value['videoNumbers']) 

	# remove duplicate videoNumbers
	for cat_key, cat_value in categories.items():
		categories[cat_key]['videoNumbers'] = list(set(cat_value['videoNumbers']))

	categoriesUrlLookup = {cat_value['url']:cat_key for cat_key, cat_value in categories.items()}

	categories['unsorted']['tags'] = sorted(list(set(tags_unsorted)))
	return categories, categoriesUrlLookup, summaries


if __name__ == '__main__':
	categoriesFilename = '../data/categories.txt'
	summariesFilename = '../data/summaries.txt'
	elderIdentifierFilename = '../data/Elder Identification - Sheet1.tsv'
	coreyfolder = '../data/WoW-Corey'
	coreyfiles = sorted(glob.glob('../data/WoW-Corey/*.docx'))
	# coreyfiles = [x.replace('../data/WoW-Corey/','') for x in coreyfiles]

	print(f'importing {categoriesFilename}')
	categoriesXML = categoriesXML(categoriesFilename)
	categoryDict = categoriesDict(categoriesXML)


	print(f'importing {summariesFilename}')
	lonnyDict = parse_summaries(summariesFilename)
	with open('lonnysummaries.json', 'w', encoding='utf-8') as out:
		out.write(json.dumps(lonnyDict, indent=4, ensure_ascii=False))

	print(f'importing {coreyfolder}')
	coreyDict = parseCoreySummaries(coreyfiles)
	with open('coreysummaries.json', 'w', encoding='utf-8') as out:
		out.write(json.dumps(coreyDict, indent=4, ensure_ascii=False))

	summariesDict = lonnyDict | coreyDict
	# with open(os.path.join("",'summaries.js'), 'w') as out:
	# 	out.write(f"export const summaries = {json.dumps(summariesDict, indent=4)};")

	print(f'adding elder identification data')
	summariesDict = addElderIdentification(elderIdentifierFilename, summariesDict)

	print(f'mixing categories and summaries')
	categories, categoriesUrlLookup, summaries = mixCategoriesSummaries(categoryDict, summariesDict)


	# TODO:
	# change up title to include "Name(s) - Village - Video #index"
	# Done: date to metadata
	# Done "videolength" data
	# add where to put in summary header in subtitles (cross reference timestamps); add before "0" timestamp
	# SKIP: add short summary to all videos 






	infoFolder = '../src/components/info'
	Path(infoFolder).mkdir(parents=True, exist_ok=True)

	print(f'creating categories.js, categoriesUrlLookup.js and summaries.js')
	with open(os.path.join(infoFolder,'categories.js'), 'w', encoding='utf-8') as out:
		out.write(f"export const categories = {json.dumps(categories, indent=4, ensure_ascii=False)};")

	with open(os.path.join(infoFolder,'categoriesUrlLookup.js'), 'w', encoding='utf-8') as out:
		out.write(f"export const categoriesUrlLookup = {json.dumps(categoriesUrlLookup, indent=4, ensure_ascii=False)};")

	with open(os.path.join(infoFolder,'summaries.js'), 'w', encoding='utf-8') as out:
		out.write(f"export const summaries = {json.dumps(summaries, indent=4, ensure_ascii=False)};")

