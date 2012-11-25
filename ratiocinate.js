/*jslint browser: true, indent: 2 */
/*global phantom, require, console, $, simplerStyle */
(function () {
  "use strict";

  var system = require('system'),
    page = require('webpage').create(),
    url = system.args[1],
    style;

  page.onConsoleMessage = function (msg, lineNum, sourceId) {
    console.log(msg);
  };
  page.open(url, function (status) {
    page.includeJs("https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js",
      function () {
        page.includeJs("https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.2/underscore-min.js",
          function () {
            if (!page.injectJs('lib/css.js')) {
              console.log("Could not inject css.js");
              phantom.exit();
            }
            style = page.evaluate(function () {
              return window.simplerStyle();
            });
            console.log(JSON.stringify(style));
            phantom.exit();
          })
      });
  });
}());
