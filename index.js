'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var nedb = require('nedb');
var path = require('path');

module.exports = function (options) {
	if (!options.db) {
		throw new gutil.PluginError('gulp-<%= pluginName %>', '`db` required');
	}

	// Loads up specified database
	var db = new nedb({
		filename: options.db,
		autoload: true
	});

	// Pattern to match a module declaration with its dependencies
	var moduleRegex = /\.module\(\s*(?:'|")([^'"]+)(?:'|")\s*,\s*(\[[^\]]*\])/;

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-<%= pluginName %>', 'Streaming not supported'));
			return;
		}

		// Get module name and its dependencies, inject them to the database
		var results = moduleRegex.exec(file.contents.toString());
		if(results[1] && results[2])
			db.update(
				{
					name: results[1]
				},
				{
					name: results[1],
					dependencies: eval(results[2]),
					path: file.path.substr(process.cwd().length+1)
				},
				{
					upsert: true
				}
			, function() {
				cb();
			});
		else
			cb();
	});
};
