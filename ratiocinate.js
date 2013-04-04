/* global phantom, CSS, require, console */

(function () {
  'use strict';

  var url,
    _               = require('./vendor/underscore-1.4.2.js'),
    args            = require('system').args.slice(1),
    resource        = require('./lib/resource.js'),
    responsive      = require('./lib/responsive.js'),
    css             = require('./lib/css.js'),
    verbose         = false,
    isOptionOrFlag  = function (item) {
      return item.length > 0 && item[0] === '-';
    },
    optionsAndFlags = _.filter(args, isOptionOrFlag);

  // parse arguments {{{

  args    = _.reject(args, isOptionOrFlag);
  verbose = _.contains(optionsAndFlags, '-v') || _.contains(optionsAndFlags, '--verbose');

  if (args.length < 1 && verbose) {
    console.log('No URL specified, please pass the name of a URL or file you\'d like analysed');
  } else {
    url = resource.resolveUrl(args[0], verbose);
  }

  // }}} parse arguments

  responsive.stylesByMediaQuery(url, function (styles, page) {
    var fonts = page.evaluate(function () { return CSS.fontDeclarations().join('\n\n'); });
    if (fonts) { console.log(fonts + '\n'); }

    _.each(styles, function (properties, mediaQuery) {
      if (mediaQuery) { console.log(mediaQuery + ' {'); }
      console.log(_.map(
        properties,
        function (style, selector) {
          return css.renderStyle(style, selector, mediaQuery ? 1 : 0);
        }
      ).join('\n'));
      if (mediaQuery) { console.log('}\n'); }
    });

    phantom.exit();
  });
}());
