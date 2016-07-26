# assemble-nunjucks [![NPM version](https://img.shields.io/npm/v/assemble-nunjucks.svg?style=flat)](https://www.npmjs.com/package/assemble-nunjucks) [![NPM downloads](https://img.shields.io/npm/dm/assemble-nunjucks.svg?style=flat)](https://npmjs.org/package/assemble-nunjucks) [![Build Status](https://img.shields.io/travis/assemble/assemble-nunjucks.svg?style=flat)](https://travis-ci.org/assemble/assemble-nunjucks)

Adds nunjucks support to assemble, with some assemble-specific conveniences.

## Usage

Add [nunjucks](https://github.com/mozilla/nunjucks) support to [assemble](https://github.com/assemble/assemble):

```js
var engine = require('assemble-nunjucks');
var assemble = require('assemble');
app.use(engine());
```

### Examples

Use with `.render`

```js
app.page({path: 'foo.njk', contents: 'this is {{name}}'});

// render a view
app.render('foo.njk', {name: 'Foo'}, function(err, res) {
  console.log(res.contents.toString());
  //=> 'this is Foo'
});
```

Use with `.renderFile`

```js
app.src('*.njk')
  .pipe(app.renderFile())
  .on('data', function(file) {
    console.log(file.contents.toString());
    //=> 'this is Foo'
  });
```

## What does this do?

Adds support for [nunjucks](https://github.com/mozilla/nunjucks)

* [rendering](#engine)
* [filters support](#filters)
* [async filters support](#async-filters)

Note that you can pass your own [env](http://mozilla.github.io/nunjucks/api.html#environment) on the options, so you can work directly with the [Nunjucks API](http://mozilla.github.io/nunjucks/api.html) if you need to do something that isn't listed here.

Pull requests are also welcome!

### Engine

Registers [engine-nunjucks](https://github.com/jonschlinkert/engine-nunjucks) to the `njk` [extension](http://mozilla.github.io/nunjucks/templating.html#file-extensions).

This means that assemble will automatically use this engine to render templates with the extension `.njk`.
To force assemble to use this engine for rendering all templates, do:

```js
app.option('engine', 'njk');
```

### Filters

Allows you to register a [nunjucks filter](http://mozilla.github.io/nunjucks/templating.html#filters) using:

```js
app.helper('foo', function(str) {
  // do stuff to str
  return str;
});
// or
app.addFilter('foo', function(str) {
  // do stuff to str
  return str;
});
```

Register multiple filters with:

```js
app.helpers({
  foo: function() {},
  bar: function() {},
  baz: function() {}
});
// or
app.addFilters({
  foo: function() {},
  bar: function() {},
  baz: function() {}
});
```

### Async Filters

Allows you to register an [async nunjucks filter](http://mozilla.github.io/nunjucks/api.html#asynchronous-support) using:

```js
app.asyncHelper('foo', function(str) {
  // do stuff to str
  return str;
});
// or
app.asyncAddFilter('foo', function(str) {
  // do stuff to str
  return str;
});
```

Register multiple filters with:

```js
app.asyncHelpers({
  foo: function() {},
  bar: function() {},
  baz: function() {}
});
// or
app.asyncAddFilters({
  foo: function() {},
  bar: function() {},
  baz: function() {}
});
```

## Customization

Optionally pass your own `nunjucks` (module):

```js
app.use(engine({nunjucks: require('nunjucks')}));
```

Optionally pass your own `env`:

```js
var nunjucks = require('nunjucks');
var env = new nunjucks.Environment();
app.use(engine({env: env}));
```

## About

### Related projects

* [engine-nunjucks](https://www.npmjs.com/package/engine-nunjucks): More comprehensive consolidate-style engine support for nunjucks. Should work with express, assemble, verb, generate, update… [more](https://github.com/jonschlinkert/engine-nunjucks) | [homepage](https://github.com/jonschlinkert/engine-nunjucks "More comprehensive consolidate-style engine support for nunjucks. Should work with express, assemble, verb, generate, update, and any other app that follows consolidate conventions.")
* [generate](https://www.npmjs.com/package/generate): Command line tool and developer framework for scaffolding out new GitHub projects. Generate offers the… [more](https://github.com/generate/generate) | [homepage](https://github.com/generate/generate "Command line tool and developer framework for scaffolding out new GitHub projects. Generate offers the robustness and configurability of Yeoman, the expressiveness and simplicity of Slush, and more powerful flow control and composability than either.")
* [update](https://www.npmjs.com/package/update): Be scalable! Update is a new, open source developer framework and CLI for automating updates… [more](https://github.com/update/update) | [homepage](https://github.com/update/update "Be scalable! Update is a new, open source developer framework and CLI for automating updates of any kind in code projects.")

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

### Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

### Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

### License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/assemble/assemble-nunjucks/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on July 26, 2016._