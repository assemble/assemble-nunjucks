'use strict';

var fs = require('fs');
var path = require('path');
var assert = require('assert');
var assemble = require('assemble');
var engine = require('..');
var app;

var fixtures = path.resolve.bind(path, __dirname, 'fixtures');
var fixture = fixtures('list.njk');
var str = fs.readFileSync(fixture, 'utf-8');
var locals = {
  list: ['alpha', 'beta', 'gamma']
};
var expected = [
  '<ul>',
  '  <li>alpha</li>',
  '  <li>beta</li>',
  '  <li>gamma</li>',
  '</ul>',
  ''
].join('\n');

describe('assemble', function() {
  beforeEach(function() {
    app = assemble();
    app.use(engine());
    app.option('engine', 'njk');
    app.create('pages');
    app.page({path: 'list.njk', contents: str});
  });

  describe('rendering', function() {
    it('should render a view with `.render`', function(cb) {
      app.render('list.njk', locals, function(err, res) {
        if (err) return cb(err);
        assert(res);
        assert(res.content);
        assert.equal(res.content.trim(), expected.trim());
        cb();
      });
    });

    it('should work directly with views', function(cb) {
      var view = app.page({path: 'list.njk', contents: str});;
      app.render(view, locals, function(err, res) {
        if (err) return cb(err);
        assert(res);
        assert(res.content);
        assert.equal(res.content.trim(), expected.trim());
        cb();
      });
    });

    it('should work with layouts', function(cb) {
      var base = app.layout({path: 'base.njk', contents: 'foo{% body %}bar'});
      var view = app.page({path: 'list.njk', contents: str, layout: 'base'});;
      app.render(view, locals, function(err, res) {
        if (err) return cb(err);
        assert(res);
        assert(res.content);
        assert.equal(res.content.trim(), 'foo' + expected.trim() + '\nbar');
        cb();
      });
    });

    it('should work with assemble `.renderFile`', function(cb) {
      var files = [];
      app.src('./test/fixtures/list.njk')
        .pipe(app.renderFile(locals))
        .on('error', cb)
        .on('data', function(file) {
          files.push(file);
        })
        .on('end', function() {
          assert(files[0]);
          assert(files[0].path);
          assert(files[0].contents);
          assert.equal(String(files[0].contents), expected);
          cb();
        });
    });
  });

  describe('.addFilter', function() {
    it('should add a filter', function(cb) {
      app.addFilter('foo', function(str) {
        return 'foo' + str;
      });

      var view = app.view({path: 'abc', content: 'bar {{title | foo}}'});
      app.render(view, {title: 'zzz'}, function(err, res) {
        if (err) return cb(err);
        assert.equal(res.contents.toString(), 'bar foozzz');
        cb();
      });
    });

    it('should work with `.helper`', function(cb) {
      app.helper('foo', function(str) {
        return 'foo' + str;
      });

      var view = app.view({path: 'abc', content: 'bar {{title | foo}}'});
      app.render(view, {title: 'zzz'}, function(err, res) {
        if (err) return cb(err);
        assert.equal(res.contents.toString(), 'bar foozzz');
        cb();
      });
    });
  });

  describe('.addFilters', function() {
    it('should add multiple filters', function(cb) {
      app.addFilters({
        foo: function(str) {
          return 'foo' + str;
        },
        bar: function(str) {
          return 'bar' + str;
        }
      });

      var one = app.view({path: 'one', content: 'one {{title | foo}}'});
      var two = app.view({path: 'two', content: 'two {{title | bar}}'});

      app.render(one, {title: 'zzz'}, function(err, res) {
        if (err) return cb(err);
        assert.equal(res.contents.toString(), 'one foozzz');

        app.render(two, {title: 'zzz'}, function(err, res) {
          if (err) return cb(err);
          assert.equal(res.contents.toString(), 'two barzzz');
          cb();
        });
      });
    });

    it('should work with `.helpers`', function(cb) {
      app.helpers({
        www: function(str) {
          return 'www' + str;
        },
        zzz: function(str) {
          return 'zzz' + str;
        }
      });

      var one = app.view({path: 'one', content: 'one {{title | www}}'});
      var two = app.view({path: 'two', content: 'two {{title | zzz}}'});

      app.render(one, {title: 'zzz'}, function(err, res) {
        if (err) return cb(err);
        assert.equal(res.contents.toString(), 'one wwwzzz');

        app.render(two, {title: 'zzz'}, function(err, res) {
          if (err) return cb(err);
          assert.equal(res.contents.toString(), 'two zzzzzz');
          cb();
        });
      });
    });
  });
});
