/* global require, exports */

(function () {
  'use strict';

  var _ = require('../vendor/underscore-1.4.2.js');

  exports.mapAndThen = function (items, map, then) {
    var left    = items.length,
      results   = [],
      afterEach = function (index) {
        return function (result) {
          results[index] = result;
          left -= 1;
          if (left < 1) {
            return then(results);
          }
        };
      };
    if (left === 0) {
      then(results);
    }

    _.each(items, function (item, idx) {
      map(item, afterEach(idx));
    });
  };
}());
