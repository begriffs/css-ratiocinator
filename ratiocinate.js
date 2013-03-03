/*jslint browser: true, indent: 2, nomen: true */
/*global phantom, require, console, $, simplerStyle, _ */
(function () {
  "use strict";

  var url, fonts,
    _               = require('./vendor/underscore-1.4.2.js'),
    args            = require('system').args.slice(1),
    resource        = require('./lib/resource.js'),
    verbose         = false,
    isOptionOrFlag  = function (item) {
      return item.length > 0 && item[0] === '-';
    },
    optionsAndFlags = _.filter(args, isOptionOrFlag);

  // parse arguments {{{

  args    = _.reject(args, isOptionOrFlag);
  verbose = _.contains(optionsAndFlags, '-v') || _.contains(optionsAndFlags, '--verbose');

  if (args.length < 1 && verbose) {
    console.log("No URL specified, please pass the name of a URL or file you'd like analysed");
  } else {
    url = resource.resolveUrl(args[0], verbose);
  }

  // }}} parse arguments

  resource.loadWithLibs(url, verbose, function (page) {
    page.evaluate(function () {
      var styles = window.simplerStyle();

      console.log("/* Begin computed CSS */");

      fonts = window.fontDeclarations().join("\n\n");
      if (fonts) { console.log(fonts + "\n"); }

      _.each(_.pairs(styles), function (pair) {
        console.log(window.renderStyle(pair[0], pair[1]));
      });
    });
    phantom.exit();
  });
}());
