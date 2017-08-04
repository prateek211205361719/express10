
var express = require('express');
var app = express();
var formidable = require('formidable');
var util = require('util');
var hbs = require('hbs');
var fs = require('fs');
app.set('view engine', hbs);
app.get('/', function(req, res){
    res.render('home.hbs');
});
app.get('/file', function(req, res){
    console.log(req.query.path);
    res.sendfile(__dirname+'/files/'+req.query.path); 
});

app.post('/', function(req, res){

    var form = new formidable.IncomingForm({
         uploadDir : __dirname+'/files',
         keepExtensions : true
    });
   form.on ('fileBegin', function(name, file){
            //rename the incoming file to the file's name
         file.path = form.uploadDir + "/" + file.name;
    })
   
    form.parse(req, function(err, fields, files) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: files}));
    });

    form.on('progress', function(bytesReceived, bytesExpected) {
        console.log('------bytesReceived------'+bytesReceived);
        console.log('--------bytesExpected----'+bytesExpected);
    });
});

app.listen(3000, function(){
    console.log('-----running------');
});
