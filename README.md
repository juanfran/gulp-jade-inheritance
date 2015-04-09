# gulp-sass-inheritance

> Rebuild a sass/scss file with other files that have extended or included those file

Based on [gulp-jade-inheritance](https://github.com/juanfran/gulp-jade-inheritance)

Uses [sass-graph](https://github.com/xzyfer/sass-graph) for the heavy lifting.

## Install

```shell
npm install gulp-sass-inheritance --save
```

## Usage

You can use `gulp-sass-inheritance` with `gulp-changed` to only process the files that have changed but also recompile files that import the one that changed.

```js
'use strict';
var gulp = require('gulp');
var sassInheritance = require('gulp-sass-inheritance');
var sass = require('gulp-sass');
var cached = require('gulp-cached');
var gulpif = require('gulp-if');
var filter = require('gulp-filter');

gulp.task('sass', function() {
    return gulp.src('src/styles/**/*.scss')

      //filter out unchanged scss files, only works when watching
      .pipe(gulpif(global.isWatching, cached('sass')))

      //find files that depend on the files that have changed
      .pipe(sassInheritance({dir: 'src/styles/'}))

      //filter out internal imports (folders and files starting with "_" )
      .pipe(filter(function (file) {
        return !/\/_/.test(file.path) || !/^_/.test(file.relative);
      }))

      //process scss files
      .pipe(sass())

      //save all the files
      .pipe(gulp.dest('dist'));
});
gulp.task('setWatch', function() {
    global.isWatching = true;
});
gulp.task('watch', ['setWatch', 'sass'], function() {
    //your watch functions...
});
```


## License

MIT
