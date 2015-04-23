## Install

```
$ npm install --save-dev gulp-angular-dependencies-builder
```


## Usage

```js
var gulp = require('gulp');
var depBuilder = require('gulp-angular-dependencies-builder');

gulp.task('default', function () {
  return gulp.src('src/**/modules.js')
    .pipe(stripComments())
    .pipe(depBuilder({
      db: 'db.dat'
    }));
});
```

## License

MIT © [Miguel Jimenez](https://github.com/miguelrjim)
