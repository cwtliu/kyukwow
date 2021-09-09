# python3 parseSummaryKeywords.py categories.txt summaries.txt
# output: categories.js summaries.js

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

import sys
from collections import defaultdict
import re
import json
import pdb
import string
from lxml import etree


rx_dict = {
	'videoID' : re.compile(r'# (?P<videoNumber>\d+) (?P<videoID>\S+)'),
	'lang' : re.compile(r'## (?P<lang>Yugtun|English)'),
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
	return data


def categoriesXML(filename):
	stack = []
	parse_line = re.compile(r'(?P<tabs>\t*)(?P<title>.*)')

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

def categoriesDict(categoryMasterTree, data_summary):
	categories = defaultdict(dict)

	# 4 layer deep subcategories, add another layer if more
	for i_0, subcategory_i in enumerate(categoryMasterTree):
		i = i_0 + 1
		i_index = str(i)
		categories[i_index]['name'] = subcategory_i.attrib['name']
		categories[i_index]['children'] = len(subcategory_i)
		categories[i_index]['videoNumbers'] = []
		for j_0, subcategory_j in enumerate(subcategory_i):
			j = j_0 + 1
			j_index = '.'.join([i_index,str(j)])
			categories[j_index]['name'] = subcategory_j.attrib['name']
			categories[j_index]['children'] = len(subcategory_j)
			categories[j_index]['videoNumbers'] = []
			for k_0, subcategory_k in enumerate(subcategory_j):
				k = k_0 + 1
				k_index = '.'.join([j_index,str(k)])
				categories[k_index]['name'] = subcategory_k.attrib['name']
				categories[k_index]['children'] = len(subcategory_k)
				categories[k_index]['videoNumbers'] = []
				for l_0, subcategory_l in enumerate(subcategory_k):
					l = l_0 + 1
					l_index = '.'.join([k_index,str(l)])
					categories[l_index]['name'] = subcategory_l.attrib['name']
					categories[l_index]['children'] = len(subcategory_l)
					categories[l_index]['videoNumbers'] = []

	return categories

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
		summary_info['tags']
		summaries[videoNumber]['tags'] = tags_new

	# add videos from children to parent
	for cat_key, cat_value in categories.items():
		for i in range(1,len(cat_key.split('.'))):
			parent = cat_key.rsplit('.',i)[0]
			categories[parent]['videoNumbers'].extend(cat_value['videoNumbers']) 

	# remove duplicate videoNumbers
	for cat_key, cat_value in categories.items():
		categories[cat_key]['videoNumbers'] = list(set(cat_value['videoNumbers']))

	categories['unsorted'] = sorted(list(set(tags_unsorted)))
	return categories, summaries


if __name__ == '__main__':
	summariesDict = parse_summaries(sys.argv[1])
	categoriesXML = categoriesXML(sys.argv[2])
	categoryDict = categoriesDict(categoriesXML, summariesDict)

	categories, summaries = mixCategoriesSummaries(categoryDict, summariesDict)


	with open('categories.js', 'w') as out:
		out.write(f"export const categories = {json.dumps(categories, sort_keys=True, indent=4)};")

	with open('summaries.js', 'w') as out:
		out.write(f"export const summaries = {json.dumps(summaries, sort_keys=True, indent=4)};")

