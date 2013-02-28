/* global phantom, CSS, require, console */

(function () {
  'use strict';

  var url,
    _               = require('./vendor/underscore-1.4.2.js'),
    args            = require('system').args.slice(1),
    resource        = require('./lib/resource.js'),
    verbose         = false,
    isOptionOrFlag  = function (item) {
      return item.length > 0 && item[0] === '-';
    },
    optionsAndFlags = _.filter(args, isOptionOrFlag),
    styles = [];

  // parse arguments {{{

  args    = _.reject(args, isOptionOrFlag);
  verbose = _.contains(optionsAndFlags, '-v') || _.contains(optionsAndFlags, '--verbose');

  if (args.length < 1 && verbose) {
    console.log('No URL specified, please pass the name of a URL or file you\'d like analysed');
  } else {
    url = resource.resolveUrl(args[0], verbose);
  }

  // }}} parse arguments

  resource.loadWithLibs(
    url,
    verbose,
    function (page) {
      var intervals = page.evaluate(function () { return CSS.mediaWidthIntervals(); }),
        fonts = page.evaluate(function () { return CSS.fontDeclarations().join('\n\n'); }),
        toGo = intervals.length,
        combineIntervals = function () { },
        addStyle = function (interval) {
          return function (page) {
            styles.push({
              properties: page.evaluate(function () {
                return CSS.simplerStyle();
              }),
              interval: interval
            });
            toGo -= 1;
            if (toGo < 1) {
              combineIntervals();
              phantom.exit();
            }
          };
        };

      if (fonts) { console.log(fonts + '\n'); }

      _.each(intervals, function (interval, i) {
        resource.loadWithLibs(
          url,
          false,
          addStyle(interval),
          interval.sample
        );
      });
    }
  );
}());
