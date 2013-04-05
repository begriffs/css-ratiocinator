/* global _, jQuery, console, CSS */

(function () {
  'use strict';

  function onScriptsLoaded() {
    var $ = jQuery.noConflict(), iframeSrc = $('<iframe />'),
      iframeDst = $('<iframe>Computing new style...</iframe>');

    console.log('WARNING: this bookmarklet is deprecated.');
    console.log('To use the the full features of Ratiocinator, try either of these options.');
    console.log('1. Use the web interface: http://www.csstrashman.com');
    console.log('2. Run the command-line version: ' +
      'https://github.com/begriffs/css-ratiocinator#usage');

    iframeSrc.attr('id', 'ratio_src');
    iframeSrc.attr(
      'style',
      'position: absolute; top: 0; left: 0; height: 100%; ' +
        'width: 50%; border-right: 1px solid black;'
    );
    iframeSrc.load(function () {
      var styles = CSS.simplerStyle(
          $(window.frames.ratioSrc.document.getElementsByTagName('html')[0])
        ),
        styleTag = $('<style type="text/css" media="all" />'),
        css = '';
      window.frames.ratioDst.document.body.innerHTML =
        window.frames.ratioSrc.document.body.innerHTML;

      _.each(_.pairs(styles), function (pair) {
        css += CSS.renderStyle(pair[0], pair[1]);
      });
      styleTag.html(css);
      $('head', window.frames.ratioDst.document).append(styleTag);
    });
    iframeSrc.attr('src', window.location.href);

    iframeDst.attr('style', 'position: absolute; top: 0; right: 0; height: 100%; width: 50%;');
    iframeDst.attr('id', 'ratio_dst');

    $('body').empty();
    $('body').append(iframeSrc);
    $('body').append(iframeDst);
  }

  var script    = document.createElement('script');
  script.src    = 'https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js';
  script.onload = function () {
    jQuery.getScript(
      'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.2/underscore-min.js',
      function () {
        jQuery.getScript(
          'https://raw.github.com/begriffs/css-ratiocinator/master/lib/css.js',
          function () {
            jQuery.getScript(
              'https://raw.github.com/begriffs/css-ratiocinator/master/lib/obj.js',
              onScriptsLoaded
            );
          }
        );
      }
    );
  };
  document.getElementsByTagName('head')[0].appendChild(script);
}());
