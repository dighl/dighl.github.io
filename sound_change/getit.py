from lingpy import *
from lingpy.sequence.sound_classes import get_all_ngrams
from lingpy.algorithm import misc
import re
import networkx as nx
import sys
import random

deu = [x[0] for x in csv2list('deu.txt')]
ahd = [x[0] for x in csv2list('ahd.txt')]

data = csv2list('goods.txt')


ngrams = {}
mods = {}
maxl = 0


def bigrams(string):

    nstring = ['#']+list(string)+['$']
    
    return [(a,b) for a,b in zip(nstring[:-1],nstring[1:])]

def sgrams(string):

    pstring = prosodic_string([s for s in string if s != '-'])
    pstring = ''.join(class2tokens(pstring,string))

    return list(zip(string,pstring))

def trigrams(string):

    nstring = ['#','#']+list(string)+['$','$']

    return [(a,b,c) for a,b,c in zip(nstring[:-2],nstring[1:-1],nstring[2:])]

gr = nx.DiGraph()

tmplist = csv2list('prepare/large_list.txt')

# make a random subset
training = random.sample(tmplist,1000)
test = [r for r in tmplist if r not in training]

#training = [tmplist[i] for i in smplA]
#test = [tmplist[i] for i in smplB]

newmods = {}
for a,b in training:

    almA,almB,sim = nw_align(a,b)
    
    ab = list(zip(almA,almB))

    #ab = list(zip(bigrams(almA),bigrams(almB)))

    #ab = list(zip(trigrams(almA),trigrams(almB)))
    #ab = list(zip(sgrams(almA),sgrams(almB)))

    first = '#'

    for seq in ab:
        
        gr.add_edge(first,seq)
        first = seq

    gr.add_edge(first,'$')
    
    for grams in get_all_ngrams([('##','##')]+ab+[('$$','$$')]):
        
        upper = ''.join([g[0][0] for g in grams if g[0][0] != '-'])
        lower = ''.join([g[1][0] for g in grams if g[1][0] != '-'])

        if len(upper) > maxl:
            maxl = len(upper)

        if upper != '#':
            try:
                mods[upper,lower] += 1
            except:
                mods[upper,lower] = 1
        try:
            newmods[upper] += [lower]
        except:
            newmods[upper] = [lower]

def find_path(ustring, debug=False):

    queue = [('#',list(gr.edge['#'].keys()),'#')]
    nstring = '#'+ustring+'$'

    outstrings = []

    while queue:
        
        # get state and paths
        pstate,paths,outstate = queue.pop(0)
        
        # debug
        if debug: print(pstate)
        
        # get next state
        if(pstate == nstring):
            pass
        else:
            idx = nstring.index(pstate) + len(pstate)
            nstate = nstring[:idx+1]
            nchar = nstring[idx]

            for node in paths:
                if node == '$' and nchar == '$':
                    outstrings += [outstate[1:]]

                elif node[0] == nchar:
                    queue += [(nstate,gr.edge[node],outstate+node[1])]

                elif node[0] == '-':
                    queue += [(nstate[:-1],gr.edge[node],outstate+node[1])]

    return outstrings

def find_path2(ustring, debug=False):

    new_string = bigrams(ustring)

    queue = [(['#'],list(gr.edge['#'].keys()),['#'],0)]
    nstring = ['#']+new_string+['$']

    outstrings = []

    while queue:
        
        # get state and paths
        pstate,paths,outstate,idx = queue.pop(0)
        
        # debug
        if debug: 
            print(pstate)
        
        # get next state
        if(pstate == nstring):
            pass
        else:
            #idx = nstring.index(pstate) + len(pstate) + 1 + pstate.count(' ')
            nstate = nstring[:idx+2]
            nchar = nstring[idx+1]
            
            if debug:
                print(idx,repr(nchar),repr(nstate),nstring,outstate)

            for node in paths:
                if node == '$' and nchar == '$':
                    outstrings += [outstate[1:]]

                elif node[0] == nchar:
                    queue += [(nstate,gr.edge[node],outstate+[node[1]],idx+1)]

                elif '-' in node[0]:
                    if node[0][1] == '-':
                        queue += [(nstate[:-1],gr.edge[node],outstate+[node[1]],idx)]
                    else:
                        queue += [(nstate[:-1],gr.edge[node],outstate+[node[1]],idx+1)]
                       
    
    for i,ostring in enumerate(outstrings):
        outstrings[i] = ''.join([a[1] for a in ostring])[:-1].replace('-','')
    return outstrings

def find_pathP(ustring, debug=False):

    new_string = sgrams(ustring)

    queue = [(['#'],list(gr.edge['#'].keys()),['#'],0)]
    nstring = ['#']+new_string+['$']

    outstrings = []

    while queue:
        
        # get state and paths
        pstate,paths,outstate,idx = queue.pop(0)
                
        # get next state
        if(pstate == nstring):
            pass
        else:
            #idx = nstring.index(pstate) + len(pstate) + 1 + pstate.count(' ')
            nstate = nstring[:idx+2]
            nchar = nstring[idx+1]
            
            #if debug:
            #    print('PSATE',len(queue),idx,''.join([a[0] for a in nstate]),''.join([a[0] for a in outstate])) #,nstring,outstate)

            for node in paths:
                #if debug:
                #    print('pnode:',node[0][0]+node[0][1],nchar[0]+nchar[1])
                if node == '$' and nchar == '$':
                    outstrings += [outstate[1:]]

                elif node[0] == nchar:
                    queue += [(nstate,gr.edge[node],outstate+[node[1]],idx+1)]

                elif node[0][0] == '-':
                    queue += [(nstate[:-1],gr.edge[node],outstate+[node[1]],idx)]                       
    
    for i,ostring in enumerate(outstrings):
        outstrings[i] = ''.join([a[0] for a in ostring]).replace('-','')
    return outstrings


def find_path3(ustring, debug=False):

    new_string = trigrams(ustring)

    queue = [(['#'],list(gr.edge['#'].keys()),['#'],0)]
    nstring = ['#']+new_string+['$']

    outstrings = []

    while queue:
        
        # get state and paths
        pstate,paths,outstate,idx = queue.pop(0)
        
        # debug
        if debug: 
            print(pstate)
        
        # get next state
        if(pstate == nstring):
            pass
        else:
            #idx = nstring.index(pstate) + len(pstate) + 1 + pstate.count(' ')
            nstate = nstring[:idx+2]
            nchar = nstring[idx+1]
            
            if debug:
                print(idx,nchar,nstate,outstate)

            for node in paths:

                if node == '$' and nchar == '$':
                    outstrings += [outstate[1:]]

                elif node[0] == nchar:
                    queue += [(nstate,gr.edge[node],outstate+[node[1]],idx+1)]

                elif '-' in node[0]:
                    #if debug:
                    #    print('GAP:',node)
                    if node[0][2] == '-':
                        queue += [(nstate[:-1],gr.edge[node],outstate+[node[1]],idx)]
                    else:
                        queue += [(nstate[:-1],gr.edge[node],outstate+[node[1]],idx+1)]

    
    for i,ostring in enumerate(outstrings):
        outstrings[i] = ''.join([a[1] for a in ostring])[1:-1].replace('-','')

    return outstrings


def split_string(string,debug=False):
    """
    Dijkstra-like approach to split a string into substrings which are
    available.
    """
    queue = [['',-1]]

    #if not string.startswith('#'):
    #    string = string
    #if not string.endswith('$'):
    #    string = string +'$'

    while queue:

        current,idx = queue.pop(0)
        if debug:
            print(current,idx)
            input()

        
        if idx == len(string)-1:
            if current in trivials:
                return True
            else:
                pass
        else:
            # get next char in string
            substr = current+string[idx+1]
            
            # append to queue the next substring, if this is a direct match
            if substr in trivials:
                queue += [['',idx+1]]
                queue += [[substr, idx+1]]
            else:
                queue += [[substr, idx+1]]

    return False

def trans_string(string,debug=False):
    """
    Dijkstra-like approach to split a string into substrings which are
    available.
    """
    queue = [['',-1,'']]
    output = []

    while queue:

        current,idx,outstr = queue.pop(0)
        if debug:
            print(current,idx)
            input()

        
        if idx == len(string)-1:
            if current in trivials:
                output += [outstr+newmods[current][0]]
            else:
                pass

        else:
            # get next char in string
            substr = current+string[idx+1]
            
            # append to queue the next substring, if this is a direct match
            if substr in trivials:
                queue += [['',idx+1,outstr+newmods[substr][0]]]
                queue += [[substr, idx+1,outstr]]
            else:
                queue += [[substr, idx+1,outstr]]

    return sorted(set(output))


trivials = ['#','$']
for i in range(maxl):

    uppers = [k[0] for k in mods if len(k[0]) == i]
    #lowers = [k[1] for k in mods if len(k[0]) == i]

    for j,u in enumerate(uppers):
        # check for triviality
        if uppers.count(u) < 2:

            ustr = u 
            if ustr:
            
                if split_string(ustr):
                    pass
                else:
                    if(len(ustr) < 10):
                        trivials += [ustr]


# now test the stuff on a more challenging list
newlist = csv2list('prepare/large_list.txt')
c = 0
cx = 0
for w2,w1 in test:

    words = trans_string('#'+w2+'$')
    #words = find_pathP(w2)

    words = [w.replace('#','').replace('$','').replace('-','') for w in words]
    
    if words:
        if len(words) == 1:
            word = words[0]

            if ''.join([w for w in word if w not in '#$-']) == w1:
                c += 1
                if w2 in ahd:
                    cx += 1
            else:
                print('?',w2,'[',word,']',w1)
        else:
            if w1 in words:
                if w2 in ahd:
                    cx += 1
                c += 1
                print(':',w2,'[',','.join([w for w in words]),']',w1)
            else:
                print('?',w2,'[',','.join([w for w in words]),']',w1)
    else:
        print('!',w2,'->',w1)
        
print(c,'{0:.2f}'.format(c/len(newlist)))
print(cx,'{0:.2f}'.format(cx/len(ahd)))



