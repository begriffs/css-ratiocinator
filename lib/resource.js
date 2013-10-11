/* global phantom, exports, require, console */

(function () {
  'use strict';

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

  exports.loadWithLibs = function (url, verbose, onload, width) {
    var page = require('webpage').create();
    if (width) {
      page.viewportSize = { width: width, height: 800 };
    }
    page.open(url, function (status) {
      if (status !== 'success' && verbose) {
        console.log('Failed to load "' + url + '"');
        phantom.exit();
      } else {
        if(page.evaluate(function () { return typeof jQuery; }) !== 'function') {
          page.injectJs('vendor/jquery-1.8.2.js');
        }
        page.injectJs('vendor/underscore-1.4.2.js');
        page.injectJs('lib/obj.js');
        page.injectJs('lib/css.js');

        page.onConsoleMessage = function (msg) {
          console.log(msg);
        };
        page.evaluate(function () {
          /* global $ */
          window.fullyLoaded = false;
          $(function () { window.fullyLoaded = true; });
        });
        waitFor(
          function () {
            return page.evaluate(function () { return window.fullyLoaded; }) === true;
          },
          function () { // aka _.partial(onload, page)
            onload(page);
          }
        );
      }
    });
  };

  function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
      start = new Date().getTime(),
      condition = false,
      interval = setInterval(function() {
        if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
          // If not time-out yet and condition not yet fulfilled
          condition = testFx(); //< defensive code
        } else {
          if(!condition) {
            // If condition still not fulfilled (timeout but condition is 'false')
            console.log('"waitFor()" timeout');
            phantom.exit(1);
          } else {
            // Condition fulfilled (timeout and/or condition is 'true')
            onReady(); //< Do what it's supposed to do once the condition is fulfilled
            clearInterval(interval); //< Stop this interval
          }
        }
      }, 250); //< repeat check every 250ms
  }
}());
