'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var nedb = require('nedb');
var path = require('path');

module.exports = function (options) {
	if (!options.db) {
		throw new gutil.PluginError('gulp-angular-dependencies-builder', '`db` required');
	}

	// Loads up specified database
	var db = options.db;

	// Pattern to match a module declaration with its dependencies
	var moduleRegex = /\.module\(\s*(?:'|")([^'"]+)(?:'|")\s*,\s*(\[[^\]]*\])/g;

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-angular-dependencies-builder', 'Streaming not supported'));
			return;
		}

		// Get module name and its dependencies, inject them to the database
		var contents = file.contents.toString();

		

		function multiProcess() {
			var results = moduleRegex.exec(contents);
			var name = null;
			var dependencies = null;
			if(results && (name=results[1]) && (dependencies=results[2])) {
				dependencies = eval(dependencies);
				db.update(
					{
						name: name
					},
					{
						name: name,
						dependencies: dependencies,
						path: file.path.substr(process.cwd().length+1)

					},
					{
						upsert: true
					}
				, function() {
					multiProcess();
				});
			}
			else
				cb();
		}

		multiProcess();
	});
};
