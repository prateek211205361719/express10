
var express = require('express');
var app = express();
var formidable = require('formidable');
var util = require('util');
var hbs = require('hbs');
var fs = require('fs');
app.set('view engine', hbs);
var port = process.env.PORT || 3000;
var dir = './files';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

app.get('/', function(req, res){
    res.render('home.hbs');
});

app.get('/file', function(req, res){
    console.log(req.query.path);
    var path = __dirname+'/files/'+req.query.path.trim();
    if (fs.existsSync(path)){
          res.sendfile(path); 
    }else{
         res.send('No file avalable');
    }
  
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
        if(err){
            res.send('Not able to read file');
        }
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: files}));
    });

    form.on('progress', function(bytesReceived, bytesExpected) {
        console.log('------bytesReceived------'+bytesReceived);
        console.log('--------bytesExpected----'+bytesExpected);
    });
});

app.listen(port, function(){
    console.log('-----running------'+port);
});
