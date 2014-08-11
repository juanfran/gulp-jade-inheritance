#gulp-jade-inheritance
[![Build Status](https://travis-ci.org/juanfran/gulp-jade-inheritance.svg?branch=master)](https://travis-ci.org/juanfran/gulp-jade-inheritance)
> Rebuild a jade file with other files that have extended or included those file

Inspired by [jade-inheritance](https://github.com/paulyoung/jade-inheritance)

## Install

```shell
npm install gulp-jade-inheritance --save-dev
```

## Usage

`gulpfile.js`
```js
var jadeInheritance = require('gulp-jade-inheritance');
var jade = require('gulp-jade');

gulp.task('jade-inheritance', function() {
  gulp.src('/jade/example.jade')
    .pipe(jadeInheritance({basedir: '/jade/'}))
    .pipe(jade());
});
```

In this example jade compile `example.jade` and all other files that have been extended or included `example.jade`. The plugin searches for those dependencies in the `basedir` directory.