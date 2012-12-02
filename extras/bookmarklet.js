/*jslint browser: true, indent: 2, nomen: true */
/*global _, jQuery, console */

(function () {
  "use strict";

  var script    = document.createElement("script");
  script.src    = "https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js";
  script.onload = function () {
    jQuery.getScript(
      'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.2/underscore-min.js',
      function () {
        jQuery.getScript(
          'https://raw.github.com/begriffs/css-ratiocinator/master/lib/css.js',
          function () {
            window.alert("Open your JS console to see generated style.");
            console.log(window.simplerStyle());
          }
        );
      }
    );
  };
  document.getElementsByTagName("head")[0].appendChild(script);
})();
