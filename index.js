'use strict';

var es = require('event-stream');
var _ = require("lodash");
var vfs = require('vinyl-fs');
var through2 = require('through2');
var gutil = require('gulp-util');
var sassGraph = require('sass-graph');
var PLUGIN_NAME = 'gulp-sass-inheritance';

var stream;

function gulpSassInheritance(options) {
  options = options || {};

  var files = [];

  function writeStream(currentFile) {
    if (currentFile && currentFile.contents.length) {
      files.push(currentFile);
    }
  }

  function endStream() {
    if (files.length) {
      var filesPaths = [];
      var graph = sassGraph.parseDir(options.dir, options)

      _.forEach(files, function(file) {

        if (graph.index && graph.index[file.path]) {
          var fullpaths = graph.index[file.path].importedBy;

          if (options.debug) {
            console.log('File', file.path);
            console.log(' - importedBy', fullpaths);
          }
          filesPaths = _.union(filesPaths, fullpaths);
        }

      });

      vfs.src(filesPaths)
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

module.exports = gulpSassInheritance;
