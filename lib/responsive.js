/*jslint browser: true, indent: 2, nomen: true */
/*global exports, require, CSS */

(function () {
  'use strict';
  var my = {},
    _ = require('../vendor/underscore-1.4.2.js');

  my.stylesByWidthInterval = function (url, callback) {
    var resource = require('./resource.js'),
      styles     = [];

    resource.loadWithLibs(
      url,
      false,
      function (page) {
        var intervals = page.evaluate(function () { return CSS.mediaWidthIntervals(); }),
          toGo = intervals.length,
          addStyle = function (interval) {
            return function (page) {
              styles.push({
                properties: page.evaluate(function () {
                  return CSS.simplerStyle();
                }),
                interval: interval
              });
              toGo -= 1;
              if (toGo < 1) {
                callback(styles, page);
              }
            };
          };

        _.each(intervals, function (interval) {
          resource.loadWithLibs(
            url,
            false,
            addStyle(interval),
            interval.sample
          );
        });
      }
    );
  };

  my.widthIntervalToMediaQuery = function (interval) {
    if (interval.min === 0 && interval.max === Infinity) {
      return '';
    }
    if (interval.min === 0) {
      return '@media (max-width: ' + interval.max + 'px)';
    }
    if (interval.max === Infinity) {
      return '@media (min-width: ' + interval.min + 'px)';
    }
    return [
      '@media (min-width: ', interval.min, 'px)',
      ' and (max-width: ', interval.max, 'px)'
    ].join('');
  };

  my.stylesByMediaQuery = function (url, callback) {
    my.stylesByWidthInterval(url, function (styles, page) {
      // get the common (independent of media query) style
      var obj = require('./obj.js'),
        properties = _.pluck(styles, 'properties'),
        commonSelectors = _.uniq(_.flatten(_.map(properties, _.keys))),
        commonStyle = _.reduce(
          commonSelectors,
          function (memo, selector) {
            memo[selector] = obj.intersection(_.pluck(properties, selector));
            return memo;
          },
          {}
        );

      // strip common style from each media query
      _.each(styles, function (style) {
        _.each(
          _.intersection(_.keys(commonStyle), _.keys(style.properties)),
          function (selector) {
            var remainingStyle = obj.difference(
              style.properties[selector],
              commonStyle[selector]
            );
            if (!_.isEmpty(remainingStyle)) {
              style.properties[selector] = remainingStyle;
            } else {
              delete style.properties[selector];
            }
          }
        );
      });

      styles = _.reduce(
        styles,
        function (result, style) {
          result[my.widthIntervalToMediaQuery(style.interval)] = style.properties;
          return result;
        },
        {}
      );
      styles[''] = commonStyle;
      callback(styles, page);
    });
  };

  if (typeof exports !== 'undefined') {
    _.extend(exports, my);
  }
  return my;
}());
