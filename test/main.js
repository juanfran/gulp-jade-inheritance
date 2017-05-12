var sassInheritance = require('../index');

var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var assert = require('stream-assert');
var gulp = require('gulp');

var assertBasename = function(basename) {
  return function(newFile) { expect(path.basename(newFile.path)).to.equal(basename) }
}

describe('gulp-sass-inheritance', function(done) {

  describe('options', function() {
    it('should throw without dir', function () {
      expect(function(){
        sassInheritance({ dir: undefined })
      }).to.throw("gulp-sass-inheritance: Missing dir in options")
    });
  });

  describe('single', function() {
    var testFolder = 'test/fixtures/single'
    it('should return a single file with no imports', function(done) {
      gulp.src([testFolder + '/index.scss'])
        .pipe(sassInheritance({ dir: testFolder }))
        .pipe(assert.length(1))
        .pipe(assert.first(assertBasename("index.scss")))
        .pipe(assert.end(done));
    })
  });

  describe('importedBy', function() {
    var testFolder = 'test/fixtures/importedBy'
    it('should return all parents importing a file', function(done) {
      gulp.src([testFolder + '/child.scss'])
        .pipe(sassInheritance({ dir: testFolder }))
        .pipe(assert.length(3))
        .pipe(assert.first(assertBasename("child.scss")))
        .pipe(assert.second(assertBasename("parent.scss")))
        .pipe(assert.nth(2, assertBasename("parent2.scss")))
        .pipe(assert.end(done));
    });
  });

  describe('nested', function() {
    var testFolder = 'test/fixtures/nested'
    it('should return all nested parents', function(done) {
      gulp.src([testFolder + '/d.scss'])
        .pipe(sassInheritance({ dir: testFolder }))
        .pipe(assert.length(4))
        .pipe(assert.nth(0, assertBasename("d.scss")))
        .pipe(assert.nth(1, assertBasename("c.scss")))
        .pipe(assert.nth(2, assertBasename("b.scss")))
        .pipe(assert.nth(3, assertBasename("a.scss")))
        .pipe(assert.end(done));
    });
  });

});
