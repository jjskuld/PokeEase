var express = require('express');
var port = process.env.PORT || 3000;
var app = express();
app.set('case sensitive routing','false')
app.use(express.static(__dirname + '/public'))
console.log('server running at http://localhost:3000 .......')
app.listen(port);