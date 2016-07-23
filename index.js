'use strict';

var isValid = require('is-valid-app');
var merge = require('mixin-deep');

module.exports = function(config) {
  return function(app) {
    if (!isValid(app, 'assemble-nunjucks', ['app', 'collection'])) return;

    var opts = merge({}, this.options, config);
    var engine = opts.nunjucks || require('engine-nunjucks');
    engine.lazyConfigure(opts);
    app.engine('njk', engine);

    var asyncHelpers = app.asyncHelpers;
    var asyncHelper = app.asyncHelper;
    var helpers = app.helpers;
    var helper = app.helper;

    function redefine(name, fn) {
      return function() {
        if (typeof fn === 'undefined') {
          return engine[name].apply(engine, arguments);
        }
        this[name].apply(this, arguments);
        return fn.apply(this, arguments);
      };
    }

    app.define({
      helpers: redefine('addFilters', helpers),
      helper: redefine('addFilter', helper),

      asyncHelpers: redefine('asyncFilters', asyncHelpers),
      asyncHelper: redefine('asyncFilter', asyncHelper),

      addFilters: redefine('addFilters'),
      addFilter: redefine('addFilter'),

      asyncFilters: redefine('asyncFilters'),
      asyncFilter: redefine('asyncFilter')
    });
  };
};
