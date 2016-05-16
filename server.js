var path = require('path');
var express = require('express');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', function (req, res) {
    res.json({ok: true});
});

app.listen(parseInt(process.env.PORT || 9876, 10));
