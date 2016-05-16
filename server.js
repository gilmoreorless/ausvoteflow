var path = require('path');
var express = require('express');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'frontend')));

function dumbRender(req, res) {
    var path = req.path.substr(1);
    res.render(path);
}

function setupDumbPaths(paths, prefix = '') {
    var prevPath = prefix;
    paths.forEach(function (path) {
        if (Array.isArray(path)) {
            setupDumbPaths(path, prevPath);
        } else {
            let fullPath = prefix + '/' + path;
            app.get(fullPath, dumbRender);
            prevPath = fullPath;
        }
    });
}

setupDumbPaths([
    '',
    'how-it-works', [
        'house-of-reps',
        'senate',
        'prime-minister',
    ],
    'results'
]);

app.listen(parseInt(process.env.PORT || 9876, 10));
