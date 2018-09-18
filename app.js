var FeedParser = require('feedparser')
  , fs = require('fs')
  , feed ='https://timesofindia.indiatimes.com/rssfeedstopstories.cms,https://economictimes.indiatimes.com/rssfeedsdefault.cms';
var request = require('request');
// var req = request(feed);
var feedparser = new FeedParser();
var Promise = require("bluebird");
// var csvWriter = require('csv-write-stream')
var Parser = require('rss-parser');
var parser = new Parser();
// var writer = csvWriter({sendHeaders: false})
var Boilerpipe = require('boilerpipe');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9203',
  log: 'info'
});

  feed.split(",").forEach(function(url){parser.parseURL(url).then(function(feed){
    var items = [];
    feed.items.forEach(function(item){

      var tmp = {'url' : item.link, 'published_on' : item.pubdate || item.pubDate,'title' : item.title, 'summary' : item.summary || item.description, 'full_text' : ''};
      console.log(tmp);
      getTextFromArticle(tmp).then(function(res){
        client.index({
             index: 'news-feed',
             type: 'feed',
             id: new Date().getTime(),
             body: tmp,
             pipeline: "opennlp-pipeline"
           }).then( function(res) {
             console.log(res);
           }, function(err){
             console.log(err);
           });        
    })
  })
})});
  

function getTextFromArticle(item){
  
  return new Promise(function(resolve, reject) {
    var boilerpipe = new Boilerpipe({
      extractor: Boilerpipe.Extractor.Article
    });
    boilerpipe.setUrl(item.url);
    boilerpipe.getText(function(err, text) {
      if(text){
        text = text.toString();
         text = text.replace(/(\r\n|\n|\r)/gm,"");
        item.full_text = text;
      }
      resolve(item);
    })
  })
};

function updateIndex(item){
  boilerpipe.setUrl(item.url);
  
  boilerpipe.getText(function(err, text) {
    // console.log(item.url);
      if(text){
          text = text.toString();
           text = text.replace(/(\r\n|\n|\r)/gm,"");
          item.full_text = text;
          console.log(item);
          client.create({
            index: 'news-feed',
            type: 'feed',
            id: new Date().getTime(),
            pipeline: "opennlp-pipeline",
            body: item
          }).then( function(res) {
            console.log(res);
          }, function(err){
            console.log(err);
          });            
      }
  });
}