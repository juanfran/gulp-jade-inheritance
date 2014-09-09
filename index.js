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
      var currentFileOptions = _.defaults(options, {'basedir': currentFile.base});
      var jadeInheritance = new JadeInheritance(currentFile.path, currentFileOptions.basedir, currentFileOptions);
      var filepath;

      for (var i = 0; i < jadeInheritance.files.length; i++) {
        filepath = options.basedir + "/" +  jadeInheritance.files[i];
        if (_.indexOf(files, filepath) === -1) {
          files.push(filepath);
        }
      }
    }
  }

  function endStream() {
    if (files.length) {
      vfs.src(files)
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
