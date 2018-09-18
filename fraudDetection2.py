#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Mar 21 15:09:30 2018

@author: vivek
"""

import numpy as np
import glob
import nltk
from nltk.corpus import wordnet, stopwords
import re

import sys, getopt

inputfile = ''
sys.argv.pop(0)
# nltk.download('punkt')
# nltk.download('stopwords')
# nltk.download('wordnet')
# keyPerson=['Vijay', 'Mallya']

# keyEvent=['fraud', 'money', 'laundering', 'sell', 'leak', 'guilty', 'kill', 'bail', 'tweeted']

#keyPerson=['vijay', 'mallya']
keyPerson = sys.argv[0].split(',')
keyEvent=['fraud', 'money', 'laundering', 'sell']

#%%


def find_files(searchfiles):
    
    fileData={}


    for file in searchfiles:
        with open(file, 'r', encoding="utf8") as f:
            x=f.read()
        
        fileData[file]=x

    
    prsn_files={}
    for fil in fileData.keys():
    
        x=nltk.word_tokenize(fileData[fil])
        y= [y1.lower() for y1 in x]
        match=False
        for i in y:
            for kp in keyPerson:
                if re.match(keyPerson[1],i):
                    match=True
        if match:
            prsn_files[fil]=fileData[fil]

    return(prsn_files)




def find_matches(data, keyEvent1):

    data_token=nltk.word_tokenize(data)
    data_token=[word.lower() for word in data_token]

    stop_word=stopwords.words('english')
    stop_word.extend(['.',','])

    data_token1=[]
    for word in data_token:
        if word not in stop_word:
            data_token1.append(word)
            
    synonyms = []
    antonyms = []

    for syn in wordnet.synsets(keyEvent1):

        for l in syn.lemmas():
            synonyms.append(l.name())
            if l.antonyms():
                antonyms.append(l.antonyms()[0].name())
           
    synonyms.extend(antonyms)

    matches=[]            
    for w in synonyms:
        if w in data_token1:
            if w not in matches:
                matches.append(w)
                
    return(matches)


#%%
data='./data/'

files=glob.glob(data+'*.txt')
#prsn_files=find_files()

##print ('files with the person:')
# for m in prsn_files.keys():
#    print(m)
    
#%%    Please select the file here to fiind the matches

# try:
#     print(sys.argv)
#     opts, args = getopt.getopt(sys.argv,"i:",["ifile="])
# except getopt.GetoptError:
#     print('fraudDetection.py -i <inputfiles>')
#     sys.exit(2)
# for opt, arg in opts:
#     if opt == '-h':
#         print('fraudDetection.py -i <inputfiles>')
#         sys.exit()
#     elif opt in ("-i", "--ifile"):
#         inputfile = arg
# print('Input file is "' + inputfile)
# files = sys.argv[0]
# files = files.split(",")
totalMatches=[]
searchf=[]
for x in files:
    # tt = './data\\' + x
    tt = x;
    searchf.append(tt)
#print(searchf)
prsn_files = find_files(searchf)
print(prsn_files)
for x in files:  
    key1 = './data\\' + x
    #print(key1)  
    #key1 = key1.replace('\\\\', chr(92))
    try:
        data=prsn_files[key1]   
        for key in keyEvent:
            mat=find_matches(data, key)
            totalMatches.extend(mat) 
    except KeyError:
    # Key is not present
        pass
for m in totalMatches:
    print(m)
#%%


