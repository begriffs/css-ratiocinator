/*jslint browser: true, indent: 2, nomen: true */
/*global _, jQuery, $, console */

(function () {
  "use strict";

  function onScriptsLoaded() {
    var $ = jQuery.noConflict(), iframe_src = $('<iframe />'),
      iframe_dst = $('<iframe>Computing new style...</iframe>');

    iframe_src.attr('id', 'ratio_src');
    iframe_src.attr('style', 'position: absolute; top: 0; left: 0; height: 100%; width: 50%; border-right: 1px solid black;');
    iframe_src.load(function () {
      var styles = window.simplerStyle($(window.frames.ratio_src.document.getElementsByTagName('html')[0])),
        style_tag = $('<style type="text/css" media="all" />'),
        css = '';
      window.frames.ratio_dst.document.body.innerHTML = window.frames.ratio_src.document.body.innerHTML;

      _.each(_.pairs(styles), function (pair) {
        css += window.renderStyle(pair[0], pair[1]);
      });
      style_tag.html(css);
      $('head', window.frames.ratio_dst.document).append(style_tag);
    });
    iframe_src.attr('src', window.location.href);

    iframe_dst.attr('style', 'position: absolute; top: 0; right: 0; height: 100%; width: 50%;');
    iframe_dst.attr('id', 'ratio_dst');

    $('body').empty();
    $('body').append(iframe_src);
    $('body').append(iframe_dst);
  }

  var script    = document.createElement("script");
  script.src    = "https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js";
  script.onload = function () {
    jQuery.getScript(
      'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.2/underscore-min.js',

      function () {
        jQuery.getScript(
          'https://raw.github.com/begriffs/css-ratiocinator/master/lib/css.js',
          onScriptsLoaded
        );
      }
    );
  };
  document.getElementsByTagName("head")[0].appendChild(script);
}());
