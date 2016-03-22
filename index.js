'use strict';

var es = require('event-stream');
var _ = require("lodash");
var vfs = require('vinyl-fs');
var through2 = require('through2');
var gutil = require('gulp-util');
var JadeInheritance = require('jade-inheritance');
var PLUGIN_NAME = 'gulp-jade-inheritance';

var stream;
var errors = {};

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
        try {
          var jadeInheritance = new JadeInheritance(file.path, options.basedir, options);
        } catch (e) {
          // prevent multiple errors on the same file
          var alreadyShown;
          if (errors[e.message]) {
            alreadyShown = true;
          }

          clearTimeout(errors[e.message]);
          errors[e.message] = setTimeout(function () {
            delete errors[e.message];
          }, 500); //debounce

          if (alreadyShown) {
            return;
          }

          var err = new gutil.PluginError(PLUGIN_NAME, e);
          stream.emit("error", err);
          return;
        }

        var fullpaths = _.map(jadeInheritance.files, function (file) {
          return options.basedir + "/" +  file;
        });

        filesPaths = _.union(filesPaths, fullpaths);
      });

      if(filesPaths.length) {
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
    } else {
      stream.emit('end');
    }
  }

  stream = es.through(writeStream, endStream);

  return stream;
};

module.exports = gulpJadeInheritance;
