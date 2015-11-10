module.exports = function(app){
	var express = require('express');
	var bodyParser = require('body-parser');
	var path = require('path');

	app.set('port', (process.env.PORT || 5000));

	var rootDir = __dirname + '/../';
	var clientbuild = rootDir + 'client';

	app.use(bodyParser.urlencoded({
	    extended: false
	}));

	app.use(bodyParser.json());

	app.use(express.static(clientbuild));

	app.engine('html', require('ejs').renderFile);
	app.set('views', path.join(rootDir, 'views_html'));

};