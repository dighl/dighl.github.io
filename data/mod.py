# author   : Johann-Mattis List
# email    : mattis.list@uni-marburg.de
# created  : 2014-06-29 23:21
# modified : 2014-06-29 23:21
"""
<++>
"""

__author__="Johann-Mattis List"
__date__="2014-06-29"

from lingpy import *

f = open('pinyin.txt','r')
data = {}
for line in f:
    ml = line[:-1]
    char = ml[:ml.index(' ')]
    rest = ml[ml.index(' ')+1:]

    restc = rest.split(' ')
    
    if char in data:
        data[char] += restc
    else:
        data[char] = restc

outf = open('pinyin.js','w')
outf.write('var pinyin = {\n  ')
for k in data:

    vals = data[k]

    outf.write('"'+k+'":["'+'","'.join(vals)+'"],\n  ')
outf.write('};')
outf.close()



