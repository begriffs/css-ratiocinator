/*jslint browser: true, indent: 2 */
/*global phantom, exports, require, console */

(function () {
  "use strict";

  exports.resolveUrl = function (url, verbose) {
    var fs = require('fs');

    // assume http if no protocol is specified
    // and we're not looking at a local file
    if (!url.match(/:\/\//)) {
      if (!fs.exists(url)) {
        url = 'http://' + url;
        if (verbose) {
          console.log('Missing protocol, assuming http');
        }
      } else if (verbose) {
        console.log('"' + url + '" exists locally, using that.');
        console.log('Prepend a protocol (e.g. http:// or https://) to override this behavior');
      }
    }
    return url;
  };

  exports.loadWithLibs = function (url, verbose, onload) {
    var page = require('webpage').create();
    page.open(url, function (status) {
      if (status !== 'success' && verbose) {
        console.log('Failed to load "' + url + '"');
        phantom.exit();
      } else {
        page.injectJs("vendor/jquery-1.8.2.js");
        page.injectJs("vendor/underscore-1.4.2.js");
        page.injectJs('lib/obj.js');
        page.injectJs('lib/css.js');

        page.onConsoleMessage = function (msg) {
          console.log(msg);
        };
        onload(page);
      }
    });
  };
}());
