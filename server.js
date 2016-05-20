var path = require('path');
var express = require('express');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use('/frontbench', express.static(path.join(__dirname, 'frontbench')));

function dumbRenderer(data) {
    return function (req, res) {
        var path = req.path.substr(1);
        res.render(path, data);
    };
}

function setupDumbPaths(paths, prefix = '') {
    Object.keys(paths).forEach(function (path) {
        let details = paths[path];
        let fullPath = prefix + '/' + path;
        let data = {
            scripts: (details.scripts || []).map(s => '/frontbench/' + s)
        };
        app.get(fullPath, dumbRenderer(data));
        if (details.children) {
            setupDumbPaths(details.children, fullPath);
        }
    });
}

setupDumbPaths({
    '': {},
    'how-it-works': {children: {
        'house-of-reps': {scripts: ['hordop.js']},
        'senate': {},
        'prime-minister': {},
    }},
    'results': {}
});

app.listen(parseInt(process.env.PORT || 9876, 10));
