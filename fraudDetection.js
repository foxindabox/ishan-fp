
var natural = require('natural');
var FraudDetection = function () {
    console.log('In Company Service Constructor.');
}

var natural = require('natural');

var keyEvents = ['fraud', 'money', 'laundering', 'sell'];

FraudDetection.prototype = {
    findMatches : function (text) {
        var stemmer = natural.PorterStemmer;
        stemmer.attach();
        // var tokenizer = new natural.WordTokenizer();
        var tokens = text.tokenizeAndStem();

        var wordnet = new natural.WordNet();
        var synonyms = [];
        var ctr = 0;
        var matches = [];
        keyEvents.forEach( (item) => {
            wordnet.lookup(item, function(results){
                ctr++;
                results.forEach(function(result) {
                    synonyms = synonyms.concat(results.synonyms);
                })
                if(ctr == keyEvents.length) {
                    synonyms = keyEvents.concat(synonyms);
                    synonyms.forEach(function(item){
                        if(tokens.indexOf(item) >= 0 && matches.indexOf(item) >= 0){
                            matches.push(item);
                        }
                    })
                }
            })
        })
        
    }
}

module.exports = FraudDetection;