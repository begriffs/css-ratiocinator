/*jslint browser: true, indent: 2, nomen: true, plusplus: true */
/*global _: true */
/*global $j: true */
/*global jQuery: true */
/*global console: true */

(function () {
  "use strict";

  var script;

  function computedCssProperties(elt, pseudoclass) {
    var style = window.getComputedStyle ? window.getComputedStyle(elt, pseudoclass || null) : elt.currentStyle;
    return _.reduce(_.keys(style),
      function (memo, prop) {
        var styleValue = style.getPropertyValue(prop);
        if (styleValue) {
          memo[prop] = styleValue;
        }
        return memo;
      }, {}) || {};
  }

  function filterKeys(obj, valid_keys) {
    return _.reduce(
      _.intersection(_.keys(obj), valid_keys),
      function (result, key) {
        result[key] = obj[key];
        return result;
      },
      {}
    );
  }

  function objectIntersection(array) {
    function simpleIntersection(a, b) {
      if (typeof a !== 'object' || typeof b !== 'object') {
        return {};
      }
      return filterKeys(a, _.intersection(_.keys(a), _.keys(b)).filter(function (key) {
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
  }

  function objectDifference(a, b) {
    if (typeof a !== 'object' || typeof b !== 'object') {
      return a;
    }
    return filterKeys(a, _.difference(_.keys(a), _.keys(b)));
  }

  function cartesianProduct() {
    return _.reduce(arguments, function (mtrx, vals) {
      return _.reduce(vals, function (array, val) {
        return array.concat(
          _.map(mtrx, function (row) { return row.concat(val); })
        );
      }, []);
    }, [[]]);
  }

  function commonStyle(nodes) {
    return objectIntersection(_.map(nodes, function (k) { return $j(k).data('style') || {}; }));
  }

  function liftHeritable(node) {
    node.children().each(function () { liftHeritable($j(this)); });

    var heritable = [
      'cursor', 'font-family', 'font-weight', 'font-stretch', 'font-style',
      'font-size', 'font-size-adjust', 'font', 'font-synthesis', 'font-kerning',
      'font-variant-ligatures', 'font-variant-position', 'font-variant-caps',
      'font-variant-numeric', 'font-variant-alternatives', 'font-variant-east-asian',
      'font-variant', 'font-feature-settings', 'font-language-override', 'text-transform',
      'white-space', 'tab-size', 'line-break', 'word-break', 'hyphens', 'word-wrap',
      'overflow-wrap', 'text-align', 'text-align-last', 'text-justify', 'word-spacing',
      'letter-spacing', 'text-indent', 'hanging-punctuation', 'text-decoration-skip',
      'text-underline-skip', 'text-emphasis-style', 'text-emphasis-color', 'text-emphasis',
      'text-emphasis-position', 'text-shadow', 'color', 'border-collapse', 'border-spacing',
      'caption-side', 'direction', 'elevation', 'empty-cells', 'line-height', 'list-style-image',
      'list-style-position', 'list-style-type', 'list-style', 'orphans', 'pitch-range',
      'pitch', 'quotes', 'richness', 'speak-header', 'speak-numeral', 'speak-punctuation',
      'speak', 'speech-rate', 'stress', 'visibility', 'voice-family', 'volume', 'widows'];

    node.children().each(function (i, kid) {
      var common = filterKeys(commonStyle([node, $j(kid)]), heritable);
      $j(kid).data('style', objectDifference($j(kid).data('style'), common));
    });
  }

  function defaultDisplayForTag(tag) {
    return {
      A: 'inline',
      ABBR: 'inline',
      ADDRESS: 'block',
      AREA: 'none',
      ARTICLE: 'block',
      ASIDE: 'block',
      AUDIO: 'inline',
      B: 'inline',
      BASE: 'inline',
      BB: 'inline',
      BDI: 'inline',
      BDO: 'inline',
      BLOCKQUOTE: 'block',
      BODY: 'block',
      BR: 'inline',
      BUTTON: 'inline-block',
      CANVAS: 'inline',
      CAPTION: 'table-caption',
      CITE: 'inline',
      CODE: 'inline',
      COMMAND: 'inline',
      DATA: 'inline',
      DATAGRID: 'inline',
      DATALIST: 'none',
      DD: 'block',
      DEL: 'inline',
      DETAILS: 'block',
      DFN: 'inline',
      DIV: 'block',
      DL: 'block',
      DT: 'block',
      EM: 'inline',
      EMBED: 'inline',
      EVENTSOURCE: 'inline',
      FIELDSET: 'block',
      FIGCAPTION: 'block',
      FIGURE: 'block',
      FOOTER: 'block',
      FORM: 'block',
      H1: 'block',
      H2: 'block',
      H3: 'block',
      H4: 'block',
      H5: 'block',
      H6: 'block',
      HEADER: 'block',
      HGROUP: 'block',
      HR: 'block',
      I: 'inline',
      IFRAME: 'inline',
      IMG: 'inline-block',
      INPUT: 'inline-block',
      INS: 'inline',
      KBD: 'inline',
      KEYGEN: 'inline-block',
      LABEL: 'inline',
      LEGEND: 'block',
      LI: 'list-item',
      LINK: 'none',
      MAP: 'inline',
      MARK: 'inline',
      MENU: 'block',
      META: 'none',
      METER: 'inline-block',
      NAV: 'block',
      NOSCRIPT: 'inline',
      OBJECT: 'inline',
      OL: 'block',
      OPTGROUP: 'inline',
      OPTION: 'inline',
      OUTPUT: 'inline',
      P: 'block',
      PARAM: 'none',
      PRE: 'block',
      PROGRESS: 'inline-block',
      Q: 'inline',
      RP: 'inline',
      RT: 'inline',
      RUBY: 'inline',
      S: 'inline',
      SAMP: 'inline',
      SCRIPT: 'none',
      SECTION: 'block',
      SELECT: 'inline-block',
      SMALL: 'inline',
      SOURCE: 'inline',
      SPAN: 'inline',
      STRONG: 'inline',
      STYLE: 'none',
      SUB: 'inline',
      SUMMARY: 'block',
      SUP: 'inline',
      TABLE: 'table',
      TBODY: 'table-row-group',
      TD: 'table-cell',
      TEXTAREA: 'inline-block',
      TFOOT: 'table-footer-group',
      TH: 'table-cell',
      THEAD: 'table-header-group',
      TIME: 'inline',
      TR: 'table-row',
      TRACK: 'inline',
      U: 'inline',
      UL: 'block',
      VAR: 'inline',
      VIDEO: 'inline'
    }[tag];
  }

  function stripDefaultStyles(node) {
    var defaults = { background: "rgba\\(0, 0, 0, 0\\) none repeat scroll 0% 0% \/ auto padding-box border-box",
      border: 'none', bottom: 'auto', clear: 'none', clip: 'auto', cursor: 'auto', margin: '^0px$', padding: '^0px$',
      direction: 'ltr', fill: '#000000', filter: 'none', float: 'none', kerning: '0', left: 'auto',
      mask: 'none', opacity: "1", outline: 'none', overflow: 'visible', position: 'static',
      resize: 'none', right: 'auto', stroke: 'none', top: 'auto', zoom: '1', height: 'auto', width: 'auto'};

    if (node.data('style')) {
      if (defaultDisplayForTag(node.prop("tagName")) === node.data('style').display) {
        delete node.data('style').display;
      }
      _.each(_.keys(defaults), function (def) {
        var prop = node.data('style')[def];
        if (prop && prop.match(new RegExp(defaults[def]))) {
          delete node.data('style')[def];
        }
      });
    }
    node.children().each(function () {
      stripDefaultStyles($j(this));
    });
  }

  function originatingSelectors(node, depth) {
    var base = {}, ret = {};
    base[node.prop("tagName")] = true;
    if (node.attr('class')) {
      _.each(node.attr('class').split(/\s+/), function (klass) {
        if (klass) {
          base['.' + klass] = true;
        }
      });
    }
    if (node.attr('id')) {
      base['#' + node.attr('id')] = true;
    }

    if (depth < 2) {
      return base;
    }
    node.children().each(function () {
      var notId = function (selector) { return selector[0] !== '#'; },
        kid_selectors = originatingSelectors($j(this), depth - 1);
      _.each(
        _.map(
          cartesianProduct(_.keys(base), _.filter(_.keys(kid_selectors), notId)),
          function (tuple) { return tuple.join(' '); }
        ),
        function (selector) { ret[selector] = true; }
      );
    });
    return ret;
  }

  function renderStyle(selector, properties) {
    if (!_.isEmpty(properties)) {
      console.log(selector + ' {');
      _.each(properties, function (val, key) {
        console.log("\t" + key + ': ' + val + ';');
      });
      console.log('}');
    }
  }

  function importance(choice) {
    return -(_.keys(choice.style).length * $j('html').find(choice.selector).length);
  }

  function onScriptsLoaded() {
    var root = $j('body'), selectors = {}, common, best;

    console.log("Computing styles...");
    $j('BODY, BODY *').each(function () {
      $j(this).data('style', computedCssProperties(this));
    });

    console.log("Lifting heritable styles...");
    liftHeritable(root);

    console.log("Stripping default styles...");
    stripDefaultStyles(root);

    console.log("Consolidating styles...\n");
    $j('BODY, BODY *').each(function () {
      var depth;
      for (depth = 1; depth <= 2; depth++) {
        $j.extend(selectors, originatingSelectors($j(this), depth));
      }
    });
    while (!_.isEmpty(selectors)) {
      common = _.map(_.keys(selectors), function (sel) {
        return { selector: sel, style: commonStyle($j('html').find(sel)) };
      });
      best   = _.sortBy(common, importance)[0];
      renderStyle(best.selector, best.style);
      $j(best.selector).each(function () {
        $j(this).data('style', objectDifference($j(this).data('style'), best.style));
      });
      delete selectors[best.selector];
    }
    console.log('/* Generated by CSS Ratiocinator */');
  }

  ////////////////////////////////////////////////////////////////////////////////////////
  // Load jQuery and underscore then begin the fun.
  console.log("Loading required external scripts...");
  script        = document.createElement("script");
  script.src    = "https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js";
  script.onload = function () {
    window.$j = jQuery.noConflict();
    jQuery.getScript(
      'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.3/underscore-min.js',
      onScriptsLoaded
    );
  };
  document.getElementsByTagName("head")[0].appendChild(script);
}());
