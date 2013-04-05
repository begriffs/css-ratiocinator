/* global phantom, require, console, _, jQuery, CSSImportRule */
(function () {
  'use strict';

  var resource = require('./lib/resource.js'),
    async      = require('./lib/async.js'),
    args       = require('system').args.slice(1),
    url        = resource.resolveUrl(args[0], false);

  resource.loadWithLibs(url, false, function (page) {
    var externalCSSUrls, internalCSS;
    externalCSSUrls = page.evaluate(function () {
      return _.uniq(_.compact(_.union(
        _.pluck(
          _.filter(
            _.flatten(_.map(_.compact(_.pluck(document.styleSheets, 'rules')), _.toArray)),
            function (rule) { return rule instanceof CSSImportRule; }
          ),
          'href'
        ),
        _.pluck(document.styleSheets, 'href')
      )));
    });
    internalCSS = page.evaluate(function () {
      return _.filter(
        _.compact(_.pluck(_.pluck(document.styleSheets, 'ownerNode'), 'innerText')),
        function (text) {
          return !text.match(/@import/);
        }
      ).join('\n');
    });
    console.log(internalCSS);

    async.mapAndThen(
      externalCSSUrls,
      function (url, continuation) {
        page.evaluate(function (url) {
          var $ = jQuery.noConflict();
          console.log($.ajax({
            url: url,
            dataType: 'html',
            async: false
          }).responseText);
        }, url);
        continuation(url);
      },
      phantom.exit
    );
  });
}());
