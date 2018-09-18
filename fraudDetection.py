#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Jun  4 12:22:49 2018

@author: rishabh991
"""

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Jun  2 18:16:52 2018

@author: rishabh991
"""

import numpy as np
import glob
import nltk
from nltk.corpus import wordnet, stopwords
from nltk.stem import PorterStemmer, WordNetLemmatizer
import re
import sys

#keyPerson=['Vijay', 'mallya']
# print(sys.argv)
keyPerson = sys.argv[1].split(',')

keyEvent=['fraud', 'money', 'laundering', 'sell']

#%%


def find_files1(files1):
    
    fileData={}


    for file in files1:
        with open(file, 'r', encoding="utf8") as f:
            x=f.read()
        
        fileData[file]=x

    
    prsn_files1={}
    for fil in fileData.keys():
    
        x=nltk.word_tokenize(fileData[fil])
        y= [y1.lower() for y1 in x]
        match=False
        for i in y:
            for kp in keyPerson:
                if re.match(keyPerson[1],i):
                    match=True
        if match:
            prsn_files1[fil]=fileData[fil]

    return(prsn_files1)
    
    

#%%
def match(key):

    synonyms = []
    antonyms = []

    for syn in wordnet.synsets(key):

        for l in syn.lemmas():
            synonyms.append(l.name())
            if l.antonyms():
                antonyms.append(l.antonyms()[0].name())
           
    synonyms.extend(antonyms)
    
   

    return(synonyms)

#%%
data='./data/'

files1=glob.glob(data+'*.txt')

prsn_files1=find_files1(files1)

#%%

matches=[]
for key in keyEvent:
    mat=match(key)
    matches.extend(mat)
    
#%%

def find_files2(prsn_files1):
    
    
    stemmer = PorterStemmer()
    lemmatiser = WordNetLemmatizer() 
    prsn_files2={}
    for m in prsn_files1.keys():
        
        x=nltk.sent_tokenize(prsn_files1[m])
        z=[] 
        for i1, i in enumerate(x):
            y=nltk.word_tokenize(i)
            for word in y:
                z.append(lemmatiser.lemmatize(word))
                z.append(stemmer.stem(word))
            
            
            condition1=False
            condition2=False
            
            for word1 in z:
                if word1 in keyPerson:
                    condition1=True
            for word2 in z:
                if word2 in matches:
                    condition2=True
                    
            z1=[]
            if condition1:
                for i2 in x[i1+1:]:
                    y1=nltk.word_tokenize(i2)
                    for word in y1:
                        z1.append(lemmatiser.lemmatize(word))
                        z1.append(stemmer.stem(word))
                    k=nltk.pos_tag(z1)
                    
                    condition3=False
                    condition4=False
                    condition5=False
                
                    for k1 in k:
                        if k1[1]=="PRP":
                            condition3=True
                
                    for k2 in k:
                        if k2[1]=="VBD" or k2[1]=="VBN" or k2[1]=="VBP":
                            condition4=True
                
                    for word3 in y1:
                        if word3 in matches:
                            condition5=True
                
                condition6= False
                condition7= False
                                    
                if condition1 and condition2:
                    condition6= True
        
                if condition3 and condition4 and condition5:
                    condition7= True
        
                
       
        
                if condition6 or condition7:
                    prsn_files2[m]=prsn_files1[m]

    return(prsn_files2)

#%%
prsn_files2=find_files2(prsn_files1)

print ('files with the person:')
for m in prsn_files2.keys():
    print(m)
                    
            