var FeedParser = require('feedparser')
  , fs = require('fs');
var csv = require("fast-csv");
var extractor = require('article-extractor');
var Boilerpipe = require('boilerpipe');
var express = require("express");
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9203',
  log: 'info'
});

var app = express();
var PythonShell = require('python-shell');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(express.static(__dirname + '/public'));
app.post('/article',function(req,res){
    var boilerpipe = new Boilerpipe({
        extractor: Boilerpipe.Extractor.Article
    });
    console.log(req.body);
    console.log(req.body.url)
    boilerpipe.setUrl(req.body.url);
    boilerpipe.getText(function(err, text) {
        console.log(err)
        if(text){
            text = text.toString();
            text = text.replace(/(\r\n|\n|\r)/gm,"");
            res.send({"text" : text});
        }
    });
});
app.get('/news', function(req, res){
    var name = req.query.name;
    name = name.split(" ");
    var options = {
        mode: 'text',
        args: name.join(',')
    };  
    PythonShell.run('fraudDetection.py', options, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
       // JSON.parse(results[0]);
       var feedMap = require("./feedMap");
       console.log(results)
       results = results.map(function(item){
            let file = item.split(":")[0]
            if(file){
                let temp = file.split('\\');
                item = item.replace(file+':', '');
                file = temp[temp.length-1];
                file = file.replace("'", "");
                return {'file' : file, 'text' : item, url: feedMap[file], keywords: ['fraud', 'money', 'laundering', 'sell']}
            }
       });
       
       results.map(element => { 
            
       });
        res.send(results);
      });      
});
app.get('/article',function(req,res){
    var boilerpipe = new Boilerpipe({
        extractor: Boilerpipe.Extractor.Article
    });
    console.log(req.query);
    console.log(req.query.url)
    boilerpipe.setUrl(req.query.url);
    boilerpipe.getText(function(err, text) {
        console.log(err)
        if(text){
            text = text.toString();
            text = text.replace(/(\r\n|\n|\r)/gm,"");
            res.send({"text" : text});
        }
    });
});
app.get('/search', function(req,res){
    var query = req.query.q;
    client.search({
        index: 'news-feed',
        q: 'full_text:' + query
    }).then(function(data){
        var items = [];
        data.hits.hits.forEach(function(item){
            items.push(item._source);
        })
        res.json(items);
    });
})
var port = process.env.PORT || 3000;
app.listen(3000, function () {
  console.log("Listening on port : " + port);
});