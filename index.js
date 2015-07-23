'use strict';

var es = require('event-stream');
var _ = require('lodash');
var fs = require('fs');
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
    var stream = this;
    if (files.length) {
      var allPaths = _.pluck(files, 'path');
      var graph = sassGraph.parseDir(options.dir, options);
      var newFiles = files;
      _.forEach(files, function(file) {
        if (graph.index && graph.index[file.path]) {
          var fullpaths = graph.index[file.path].importedBy;

          fullpaths.forEach(function (path) {
            if (!_.include(allPaths, path)) {
              allPaths.push(path);
              newFiles.push(new gutil.File({
                cwd: file.cwd,
                base: file.base,
                path: path,
                stat: fs.statSync(path),
                contents: fs.readFileSync(path)
              }));
            }
          });

          if (options.debug) {
            console.log('File', file.path);
            console.log(' - importedBy', fullpaths);
          }
        }

      });
      es.readArray(files)
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
}

module.exports = gulpSassInheritance;
