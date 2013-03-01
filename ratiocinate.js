/*jslint browser: true, indent: 2, nomen: true */
/*global phantom, require, console, $, simplerStyle, _ */
(function () {
  "use strict";

  var system = require('system'),
    page = require('webpage').create(),
    fs = require('fs'),
    url = system.args[1],
    fonts;

  // assume http if no protocol is specified
  // and we're not looking at a local file
  if (!url.match(/:\/\//)) {
    if (!fs.exists(url)) {
      console.log('Missing protocol, assuming http');
      url = 'http://' + url;
    } else {
      console.log('"' + url + '" exists locally, using that.');
      console.log('Prepend a protocol (e.g. http:// or https://) to override this behavior');
    }
  }

  page.onConsoleMessage = function (msg) {
    console.log(msg);
  };
  page.open(url, function (status) {
    if (status !== 'success') {
      console.log('Failed to load "' + url + '"');
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
