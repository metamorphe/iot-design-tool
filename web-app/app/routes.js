var path = require('path');
//var db = require(__dirname + '/../config/db');
//var mongoose = require('mongoose');

module.exports = function(app) {
    // Server Routes ==================

    // To be implemented as neessary

    // Frontend Routes ===============
    app.get('*', function (req, res) {
        res.sendfile(path.join(__dirname + '/../public/index.html'));
    });
}
