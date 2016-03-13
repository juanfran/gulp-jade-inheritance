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

### Only process changed files

You can use `gulp-jade-inheritance` with `gulp-changed` and `gulp-cached` to only process the files that have changed. This also prevent partials from being processed separately by marking them with an underscore before their name.

```js
'use strict';
var gulp = require('gulp');
var jadeInheritance = require('gulp-jade-inheritance');
var jade = require('gulp-jade');
var changed = require('gulp-changed');
var cached = require('gulp-cached');
var gulpif = require('gulp-if');
var filter = require('gulp-filter');

gulp.task('jade', function() {
    return gulp.src('app/**/*.jade')

        //only pass unchanged *main* files and *all* the partials
        .pipe(changed('dist', {extension: '.html'}))

        //filter out unchanged partials, but it only works when watching
        .pipe(gulpif(global.isWatching, cached('jade')))

        //find files that depend on the files that have changed
        .pipe(jadeInheritance({basedir: 'app'}))

        //filter out partials (folders and files starting with "_" )
        .pipe(filter(function (file) {
            return !/\/_/.test(file.path) && !/^_/.test(file.relative);
        }))

        //process jade templates
        .pipe(jade())

        //save all the files
        .pipe(gulp.dest('dist'));
});
gulp.task('setWatch', function() {
    global.isWatching = true;
});
gulp.task('watch', ['setWatch', 'jade'], function() {
    //your watch functions...
});
```

If you want to prevent partials from being processed, mark them with an underscore before their name or their parent folder's name. Example structure:

```
/app/index.jade
/app/_header.jade
/app/_partials/article.jade
/dist/
```

To install all that's need for it:

```shell
npm install gulp-jade-inheritance gulp-jade gulp-changed gulp-cached gulp-if gulp-filter --save-dev
```

### jade >= 1.11

if your using jade 1.11 add `"jade": "^1.11.0"` to your `package.json` to overwrite the jade-inheritance version. [Issue](https://github.com/paulyoung/jade-inheritance/issues/15)

