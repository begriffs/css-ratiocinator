/* global require, exports */
/* exported OBJ */

if (typeof require !== 'undefined') {
  var _ = require('../vendor/underscore-1.4.2.js');
}

var OBJ = (function () {
  'use strict';
  var my = {};

  my.intersection = function (array) {
    function simpleIntersection(a, b) {
      if (typeof a !== 'object' || typeof b !== 'object') {
        return {};
      }
      return _.pick(a, _.intersection(_.keys(a), _.keys(b)).filter(function (key) {
        return _.isEqual(a[key], b[key]);
      }));
    }
    function repeatedly(f) {
      return function (args) {
        if (args.length === 0) { return {}; }
        var seed = args.pop();
        return _.reduce(args, function (memo, obj) { return f(memo, obj); }, seed);
      };
    }

    return repeatedly(simpleIntersection)(array);
  };

  my.difference = function (a, b) {
    if (typeof a !== 'object' || typeof b !== 'object') {
      return a;
    }
    return _.pick(a, _.difference(_.keys(a), _.keys(b)));
  };

  my.cartesianProduct = function () {
    return _.reduce(arguments, function (mtrx, vals) {
      return _.reduce(vals, function (array, val) {
        return array.concat(
          _.map(mtrx, function (row) { return row.concat(val); })
        );
      }, []);
    }, [[]]);
  };

  if (typeof exports !== 'undefined') {
    _.extend(exports, my);
  }
  return my;
}());
