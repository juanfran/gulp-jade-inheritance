var pluginPath = '../index';
var plugin = require(pluginPath);
var chai = require('chai');
var expect = chai.expect;
var gutil = require('gulp-util');
var fs = require('fs');

// var proxyquire = require('proxyquire');
// var sinon = require('sinon');
// var gutil = require('gulp-util');

var getFixtureFile = function (path) {
  return new gutil.File({
    path: './test/fixtures/' + path,
    cwd: './test/',
    base: './test/fixtures/',
    contents: fs.readFileSync('./test/fixtures/' + path)
  });
}

describe('gulp-jade-inheritance', function(done) {
  it('jade with parents', function(done) {
    var fixture = getFixtureFile('fixture1.jade')

    var fileNames = [
      'fixture1.jade',
      'fixture2.jade',
      'fixture3.jade'
    ];

    var files = [];

    var stream = plugin();
    stream
      .on('data', function (file) {
        expect(fileNames).to.include(file.relative);

        files.push(file);
      })
      .once('end', function() {
        expect(files).to.have.length(3);

        done();
      });

    stream.write(fixture);
    stream.end();
  });

  it('jade without parents', function(done) {
    var fixture = getFixtureFile('fixture4.jade')

    var files = [];

    var stream = plugin();
    stream
      .on('data', function (file) {
        files.push(file);
      })
      .once('end', function() {
        expect(files).to.have.length(1);

        done();
      });

    stream.write(fixture);
    stream.end();
  });

  describe('custom basedir', function(done) {
    it('wrong path', function(done) {
      var fixture = getFixtureFile('fixture1.jade')

      var files = [];

      var stream = plugin({basedir: 'test/fixtures2'});
      stream
        .on('data', function (file) {
          files.push(file);
        })
        .once('end', function() {
          expect(files).to.have.length(1);

          done();
        });

      stream.write(fixture);
      stream.end();
    });

    it('valid path', function(done) {
      var fixture = getFixtureFile('fixture1.jade')

      var files = [];

      var stream = plugin({basedir: 'test/fixtures'});
      stream
        .on('data', function (file) {
          files.push(file);
        })
        .once('end', function() {
          expect(files).to.have.length(3);

          done();
        });

      stream.write(fixture);
      stream.end();
    });
  });
});
