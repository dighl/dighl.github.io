# author   : Johann-Mattis List
# email    : mattis.list@uni-marburg.de
# created  : 2014-10-22 16:52
# modified : 2014-10-22 16:52
"""
convert tppsr data to qlc table for easy editing possibilities
"""

__author__="Johann-Mattis List"
__date__="2014-10-22"

from lingpyd import *
import json

# get places first
orte = csv2list('datapoints.tsv')
dpoints = {}
for line in orte:
    dpoints[line[0]] = dict(zip(['Location','Kanton','Long','Lat'], line[1:]))

# now get the headwords
headw = csv2list('headwords.tsv')
headwords = {}
for line in headw:
    headwords[line[0]] = dict(zip(['French','Latin'], line[1:]))

# now get full table (first only ipa)
tppsrx = csv2list('tppsr.tsv')
tppsr_wl = []

for line in tppsrx:

    tmp = []
    tmp += [line[0]]

    hw = [headwords[line[1]]['French'], headwords[line[1]]['Latin']]
    dp = [dpoints[line[2]]['Location'], dpoints[line[2]]['Kanton'],
            dpoints[line[2]]['Long'], dpoints[line[2]]['Lat']]
    tmp += hw
    tmp += dp
    tmp += [line[3]]
    tppsr_wl += [tmp]

tppsr_ipa = csv2list('tppsr_ipa.tsv')
for i,line in enumerate(tppsr_ipa):
    tppsr_wl[i] += [line[3]]

with open('tppsr.qlc', 'w') as f:
    f.write('\t'.join([
        'ID',
        'CONCEPT',
        'LATIN',
        'TAXA',
        'KANTON',
        'LAT',
        'LON',
        'COUNTERPART', 'IPA'
        ])+'\n')
    for line in tppsr_wl:
        f.write('\t'.join(line)+'\n')

# load into lingpy wordlist
wl = Wordlist('tppsr.qlc')

wl.add_entries('classes', 'ipa', lambda x: tokens2class(ipa2tokens(x.replace(' ','_')),
    rc('sca')))

DX = []
WX = []
for concept in sorted(wl.concepts):
    
    print(concept)
    idxs = wl.get_list(concept=concept, flat=True)

    D = {}
    D['french'] = concept
    D['latin'] = wl[idxs[0],'latin']

    for idx in idxs:

        D['entry_'+str(idx)] = dict(
                taxon = wl[idx,'taxon'],
                canton = wl[idx,'kanton'],
                ipa = wl[idx,'ipa'],
                tppsr = wl[idx,'counterpart'],
                lat = wl[idx,'lat'],
                lon = wl[idx,'lon'],
                classes = ''.join(wl[idx,'classes'])
                )

    
    newc = ''.join([c for c in concept.lower() if c in 'abcdefghijklmnopqrstuvwxyz'])
    DX += [newc]
    WX += [concept]
    with open('../json/'+newc+'.json','w') as f:
        f.write(json.dumps(D, indent=2))

with open('../media/tppsr.data.js','w') as f:
    f.write('FILES = '+json.dumps(DX)+';\n')
    f.write('CONCEPTS = '+json.dumps(WX)+';\n')


