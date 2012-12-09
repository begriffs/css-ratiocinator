/*jslint browser: true, indent: 2, nomen: true */
/*global phantom, require, console, $, simplerStyle, _ */
(function () {
  "use strict";

  var system = require('system'),
    page = require('webpage').create(),
    url = system.args[1];

  page.onConsoleMessage = function (msg) {
    console.log(msg);
  };
  page.open(url, function (status) {
    if (status !== 'success') {
      console.log('Failed to load "' + url + '"');
      if (!url.match(/^http/)) {
        console.log('  (Perhaps you meant "http://' + url + '")');
      }
    } else {
      page.injectJs("vendor/jquery-1.8.2.js");
      page.injectJs("vendor/underscore-1.4.2.js");
      page.injectJs('lib/css.js');

      page.evaluate(function () {
        var styles = window.simplerStyle();
        _.each(_.pairs(styles), function (pair) {
          console.log(window.renderStyle(pair[0], pair[1]));
        });
      });
    }
    phantom.exit();
  });
}());
