var FeedParser = require('feedparser')
  , fs = require('fs');
var csv = require("fast-csv");
var extractor = require('article-extractor');
var csvWriter = require('csv-write-stream')
var Boilerpipe = require('boilerpipe');
var elasticsearch = require('elasticsearch');
var async = require('async');
var PythonShell = require('python-shell');
var client = new elasticsearch.Client({
  host: 'localhost:9201',
  log: 'trace'
});
fsmonitor = require('fsmonitor');
var fs = require('fs');

var csvWriter = require('csv-write-stream')
 var monitor = fsmonitor.watch('.', {
    // include files
    matches: function(relpath) {
        return relpath.match(/\.csv$/i) !== null;
    },
    // exclude directories
    excludes: function(relpath) {
        return relpath.match(/^\.git$/i) !== null;
    }
});
monitor.on('change', function(changes) {
    if(changes.modifiedFiles.indexOf('feed.csv') >= 0){
    var boilerpipe = new Boilerpipe({
        extractor: Boilerpipe.Extractor.Article
    });
    var calls = [];
csv
 .fromPath("feed.csv")
 .on("data", function(data){
    //  console.log(data[0]);
     var feed = data[0];
   
    var tmp = {'link' : data[0], 'pubdate' : data[1], 'date' : data[2], 'title' : data[3], 'summary' : data[4]}
    calls.push((callback) => {
        boilerpipe.setUrl(feed);
        boilerpipe.getText(function(err, text) {
            //console.log(err)
            if(text){
                text = text.toString();
                text = text.replace(/(\r\n|\n|\r)/gm,"");
                tmp.text = text;
                let a = {};
                a.text = text;
                //items.push({'link' : item.link, 'pubdate' : item.pubdate, 'date' : item.date, 'title' : item.title, 'summary' : item.summary});
    
                
                
            }
            callback(false,text);
        });
    })    
 })
 .on("end", function(){
     async.parallel(calls, function(err, results){
        let paths = [];
        results.forEach(element => {
            console.log(element);
            let temp = "file" + new Date().getTime() + ".txt";
            console.log(temp);
            if(element){
                paths.push(temp);
                fs.writeFile('data/' + temp, element)
            }
        });
        var options = {
            mode: 'text',
            args: paths.join(',')
        };  
        PythonShell.run('fraudDetection.py', options, function (err, results) {
            if (err) throw err;
            // results is an array consisting of messages collected during execution
            console.log('results: %j', results);
          });              
     });
 });
    }
});


