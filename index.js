'use strict';

var es = require('event-stream');
var _ = require("lodash");
var vfs = require('vinyl-fs');
var through2 = require('through2');
var gutil = require('gulp-util');
var JadeInheritance = require('jade-inheritance');
var PLUGIN_NAME = 'gulp-jade-inheritance';

var stream;

function gulpJadeInheritance(options) {
  options = options || {};

  var files = [];

  function writeStream(currentFile) {
    if (currentFile && currentFile.contents.length) {
      files.push(currentFile);
    }
  }

  function endStream() {
    if (files.length) {
      var jadeInheritanceFiles = [];
      var filesPaths = [];

      options = _.defaults(options, {'basedir': process.cwd()});

      _.forEach(files, function(file) {
        var jadeInheritance = new JadeInheritance(file.path, options.basedir, options);

        var fullpaths = _.map(jadeInheritance.files, function (file) {
          return options.basedir + "/" +  file;
        });

        filesPaths = _.union(filesPaths, fullpaths);
      });

      vfs.src(filesPaths, {'base': options.basedir})
        .pipe(es.through(
          function (f) {
            stream.emit('data', f);
          },
          function () {
            stream.emit('end');
          }
      ));
    } else {
      stream.emit('end');
    }
  }

  stream = es.through(writeStream, endStream);

  return stream;
};

module.exports = gulpJadeInheritance;
