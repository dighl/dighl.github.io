from lingpyd import *
from lingpyd.model.sound_change import *
import random
stuff = csv2list('prepare/large_list.txt')

random.shuffle(stuff)

#deu = [c[0] for c in csv2list('deu.txt')]
#ahd = [c[0] for c in csv2list('ahd.txt')]
#
#stuff = list(zip(ahd,deu))

scr = SoundChanger(stuff[:1000], mode='pgrams')
scr.get_trivials()
print(len(scr.trivials))

# evaluate performance
c = 0
d = 0
for w1,w2 in stuff[:1000]:
    words = scr.transform(w1,mode='pgrams')
    if len(words) == 1:
        if words[0] == w2:
            c += 1
        else:
            print(w1,w2,words[0],':)')
    elif len(words) > 1:
        if w2 in words:
            d += 1
            print(w1,w2,' '.join(words))
        else:
            print(w1,w2,':(',' '.join(words))
    else:
        print(w1,w2,' '.join(words))

print(c,d,c/len(stuff))
