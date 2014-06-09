from lingpy import *
import re

d1 = csv2dict('deu_ancestor.csv')
d2 = csv2dict('deu_pronunciation.csv')

deword = lambda x: x.split(':')[1].split('@')[0].lower()

data = []
data2 = []
for k in d1:
    if 'lang:deu' in k:
        try:
            deu = d2[k][0]
            if 'lang:GOH' in d1[k][0]:

                ohg = d2[d1[k][0]][0]

                #deu = ' '.join(ipa2tokens(deu))
                #ohg = ' '.join(ipa2tokens(ohg))
                #d = edit_dist(deu,ohg, normalized=True)
                #if d < 0.3 and deu != ohg and ohg not in deu:
                #    data += [(deu,ohg,d)]
                data2 += [[ohg,deu]]
        except:
            print(k)

##ohg = open('../js/ohg.js','w')
#deu = open('../js/deu.js','w')
#both = open('deu_ohg.txt','w')
#ohg.write('var ohg = [\n')
#deu.write('var deu = [\n')
#for i,(a,b,c) in enumerate(sorted(data,key=lambda x: x[2],reverse=True)):
#    if i < len(data)-1:
#        ohg.write('"'+b+'",\n')
#        deu.write('"'+a+'",\n')
#    else:
#        ohg.write('"'+b+'"];\n')
#        deu.write('"'+b+'"];\n')
#
#    both.write(a+'\t'+b+'\n')
#
#ohg.close()
#deu.close()
#both.close()

with open('large_list.txt','w') as f:
    for line in data2:
        f.write('\t'.join(line)+'\n')
        


