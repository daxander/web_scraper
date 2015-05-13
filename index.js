

var cheerio = require("cheerio");
var request = require('request');
var csv = require('fast-csv');
var path = require('path');
var fs = require('fs')


var csvStream = csv.createWriteStream({headers: true}),
    writableStream = fs.createWriteStream("images.csv");
 
writableStream.on("finish", function(){
  console.log("DONE!");
});

request('http://substack.net/images/', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(body);
    csvStream.pipe(writableStream);
    $('tr').each(function(i, element) {
      var url = 'http://substack.net/images' + $(this).find('a').attr('href');
      var permissions = $(this).children().first().text();
      var type = path.extname(url);
      var arr = [permissions,url,type];

      csvStream.write(arr);

    });
    csvStream.end();

  }
})

