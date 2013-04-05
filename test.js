/* global phantom, require, _, CSS, jasmine, describe, it, expect */
(function () {
  'use strict';

  phantom.injectJs('./vendor/underscore-1.4.2.js');
  phantom.injectJs('./vendor/jasmine-1.3.1/jasmine.js');
  phantom.injectJs('./vendor/phantom-jasmine/console-runner.js');
  jasmine.getEnv().addReporter(new jasmine.ConsoleReporter());

  var fs      = require('fs'),
    resource  = require('./lib/resource.js'),
    scenarios = _.map(
      _.filter(
        fs.list(fs.workingDirectory + fs.separator + 'test'),
        function (filename) { return filename.match(/\.html$/); }
      ),
      function (filename) {
        return fs.absolute('test' + fs.separator + filename);
      }
    ),
    scenariosLoaded = 0;

  function runTestsAfterScenariosLoaded() {
    if (scenariosLoaded === scenarios.length) {
      var oldCallback = jasmine.getEnv().currentRunner().finishCallback;
      jasmine.getEnv().currentRunner().finishCallback = function () {
        oldCallback.apply(this, arguments);
        phantom.exit();
      };
      jasmine.getEnv().execute();
    }
  }

  _.each(scenarios, function (scenario) {
    resource.loadWithLibs(scenario, false, function (page) {
      var expected = page.evaluate(function () {
          return window.expectedStyle;
        }),
        calculated = page.evaluate(function () {
          return CSS.simplerStyle();
        });

      describe(scenario, function () {
        it('should see expected style', function () {
          expect(expected).toEqual(calculated);
        });
      });

      scenariosLoaded += 1;
      runTestsAfterScenariosLoaded();
    });
  });
}());
