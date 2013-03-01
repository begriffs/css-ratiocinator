/*jslint browser: true, indent: 2, nomen: true */
/*global phantom, require, console, $, simplerStyle, _ */
(function () {
  "use strict";

  var url, fonts,
    _              = require('./vendor/underscore-1.4.2.js'),
    args           = require('system').args.slice(1),
    fs             = require('fs'),
    page           = require('webpage').create(),
    verbose        = false,
    isOptionOrFlag = function(item) {
      return item.length > 0 && item[0] === '-';
    };

  // parse arguments {{{

  var optionsAndFlags = _.filter(args, isOptionOrFlag);
  args                = _.reject(args, isOptionOrFlag);

  verbose = _.contains(optionsAndFlags, '-v') || _.contains(optionsAndFlags, '--verbose');

  if (args.length < 1 && verbose) {
    console.log("No URL specified, please pass the name of a URL or file you'd like analysed");
  } else {
    url = args[0];
  }

  // assume http if no protocol is specified
  // and we're not looking at a local file
  if (!url.match(/:\/\//)) {
    if (!fs.exists(url)) {
      url = 'http://' + url;
      verbose && console.log('Missing protocol, assuming http');
    } else if(verbose) {
      console.log('"' + url + '" exists locally, using that.');
      console.log('Prepend a protocol (e.g. http:// or https://) to override this behavior');
    }
  }

  // }}} parse arguments

  page.onConsoleMessage = function (msg) {
    console.log(msg);
  };

  page.open(url, function (status) {
    if (status !== 'success') {
      verbose && console.log('Failed to load "' + url + '"');
    } else {
      page.injectJs("vendor/jquery-1.8.2.js");
      page.injectJs("vendor/underscore-1.4.2.js");
      page.injectJs('lib/css.js');

      page.evaluate(function () {
        var styles = window.simplerStyle();

        console.log("/* Begin computed CSS */");

        fonts = window.fontDeclarations().join("\n\n");
        if (fonts) { console.log(fonts + "\n"); }

        _.each(_.pairs(styles), function (pair) {
          console.log(window.renderStyle(pair[0], pair[1]));
        });
      });
    }
    phantom.exit();
  });
}());
