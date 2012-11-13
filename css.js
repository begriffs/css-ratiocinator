/*jslint browser: true, indent: 2, nomen: true, plusplus: true */
/*global _: true */
/*global $: true */
/*global jQuery: true */
/*global console: true */

(function () {
  "use strict";

  var script;

  function camel2dashed(str) {
    return str.replace(/([A-Z])/g, function (c) {return "-" + c.toLowerCase(); });
  }

  function computedCssNode(elt) {
    var style = window.getComputedStyle ? window.getComputedStyle(elt, null) : elt.currentStyle,
      styleValue;
    return _.reduce(_.keys(style),
      function (memo, prop) {
        styleValue = style.getPropertyValue(prop);
        if (styleValue) {
          memo[prop] = styleValue;
        }
        return memo;
      }, {});
  }

  function computedCssTree(elt) {
    if (!elt) {
      return [];
    }
    return {
      tag: elt[0].tagName,
      klass: elt.attr('class'),
      id: elt.attr('id'),
      css: computedCssNode(elt[0]),
      children: _.map(elt.children(), function (c) { return computedCssTree($(c)); })
    };
  }

  function filterKeys(obj, valid_keys) {
    return _.intersection(_.keys(obj), valid_keys).reduce(function (result, key) {
      result[key] = obj[key];
      return result;
    }, {});
  }

  function objectIntersection(array) {
    function simpleIntersection(a, b) {
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
    return filterKeys(a, _.difference(_.keys(a), _.keys(b)));
  }

  function liftHeritable(node) {
    var i, heritable = [
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
      'speak', 'speech-rate', 'stress', 'visibility', 'voice-family', 'volume', 'widows'],
      disinherited_kids = _.map(node.children, liftHeritable),
      common = filterKeys(
        objectIntersection(_.map(disinherited_kids, function (k) { return k.css; })),
        heritable
      );

    for (i = 0; i < disinherited_kids.length; i++) {
      disinherited_kids[i].css = objectDifference(disinherited_kids[i].css, common);
    }
    $.extend(node.css, common);
    return {
      tag: node.tag,
      klass: node.klass,
      id: node.id,
      css: node.css,
      children: disinherited_kids
    };
  }

  function defaultDisplayForTag(tag) {
    return {
      A: 'inline', ABBR: 'inline', ADDRESS: 'block', AREA: 'none',
      ARTICLE: 'block', ASIDE: 'block', AUDIO: 'inline', B: 'inline',
      BASE: 'inline', BB: 'inline', BDI: 'inline', BDO: 'inline', BLOCKQUOTE:
      'block', BODY: 'block', BR: 'inline', BUTTON: 'inline-block', CANVAS:
      'inline', CAPTION: 'table-caption', CITE: 'inline', CODE: 'inline',
      COMMAND: 'inline', DATA: 'inline', DATAGRID: 'inline', DATALIST:
      'none', DD: 'block', DEL: 'inline', DETAILS: 'block', DFN: 'inline',
      DIV: 'block', DL: 'block', DT: 'block', EM: 'inline', EMBED: 'inline',
      EVENTSOURCE: 'inline', FIELDSET: 'block', FIGCAPTION: 'block',
      FIGURE: 'block', FOOTER: 'block', FORM: 'block', H1: 'block', H2:
      'block', H3: 'block', H4: 'block', H5: 'block', H6: 'block', HEADER:
      'block', HGROUP: 'block', HR: 'block', I: 'inline', IFRAME: 'inline',
      IMG: 'inline-block', INPUT: 'inline-block', INS: 'inline', KBD:
      'inline', KEYGEN: 'inline-block', LABEL: 'inline', LEGEND: 'block',
      LI: 'list-item', LINK: 'none', MAP: 'inline', MARK: 'inline', MENU:
      'block', META: 'none', METER: 'inline-block', NAV: 'block', NOSCRIPT:
      'inline', OBJECT: 'inline', OL: 'block', OPTGROUP: 'inline', OPTION:
      'inline', OUTPUT: 'inline', P: 'block', PARAM: 'none', PRE: 'block',
      PROGRESS: 'inline-block', Q: 'inline', RP: 'inline', RT: 'inline',
      RUBY: 'inline', S: 'inline', SAMP: 'inline', SCRIPT: 'none', SECTION:
      'block', SELECT: 'inline-block', SMALL: 'inline', SOURCE: 'inline',
      SPAN: 'inline', STRONG: 'inline', STYLE: 'none', SUB: 'inline',
      SUMMARY: 'block', SUP: 'inline', TABLE: 'table', TBODY: 'table-row-group',
      TD: 'table-cell', TEXTAREA: 'inline-block', TFOOT: 'table-footer-group',
      TH: 'table-cell', THEAD: 'table-header-group', TIME: 'inline', TR:
      'table-row', TRACK: 'inline', U: 'inline', UL: 'block', VAR: 'inline',
      VIDEO: 'inline'}[tag];
  }

  function stripDefaultStyles(node) {
    var defaults = { background: 'rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box',
      border: 'none', bottom: 'auto', clear: 'none', clip: 'auto', cursor: 'auto',
      direction: 'ltr', fill: '#000000', filter: 'none', float: 'none', kerning: '0', left: 'auto',
      mask: 'none', opacity: "1", outline: 'none', overflow: 'visible', position: 'static',
      resize: 'none', right: 'auto', stroke: 'none', top: 'auto', zoom: '1', height: 'auto', width: 'auto'};

    if (defaultDisplayForTag(node.tag) === node.css['display']) {
      delete node.css['display'];
    }

    _.each(_.keys(defaults), function (def) {
      var prop = node.css[def];
      if (prop && prop.indexOf(defaults[def]) > -1) {
        delete node.css[def];
      }
    });
    _.each(node.children, function (k) {
      stripDefaultStyles(k);
    });
  }

  function selectorsUsed(node) {
    function tagDict(node) {
      var dict = {};
      dict[node.tag] = true;
      if (node.klass) {
        _.each(node.klass.split(/\s+/), function (klass) {
          dict['.' + klass] = true;
        });
      }
      _.each(node.children, function (k) { $.extend(dict, tagDict(k)); });
      return dict;
    }
    return _.keys(tagDict(node));
  }

  function select(root, condition) {
    var collection = [];
    if (condition(root)) {
      collection.push(root);
    }
    _.each(root.children, function (k) { collection = collection.concat(select(k, condition)); });
    return collection;
  }

  function apply(condition, transformation) {
    function applyToNode(node) {
      var ret = condition(node) ? transformation(node) : node;
      ret.children = _.map(ret.children, function (k) {
        return applyToNode(k, condition, transformation);
      });
      return ret;
    }
    return applyToNode;
  }

  function checkMatch(selector) {
    return function (node) {
      var classRegexp;
      if (!node) {
        return false;
      }
      if (selector[0] === '.' && node.klass) {
        classRegexp = new RegExp('\\b' + selector.substring(1) + '\\b');
        return node.klass.match(classRegexp);
      }
      return node.tag === selector;
    };
  }

  function styleConsolidations(node) {
    return _.reduce(selectorsUsed(node),
      function (memo, selector) {
        var instances = select(node, checkMatch(selector));
        memo[selector] = objectIntersection(_.map(instances, function (i) { return i.css; }));
        return memo;
      }, {});
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

  function selectorPropertyCount(consolidation) {
    return _.map(consolidation, function (properties, tag) {
      var ret = {};
      ret[tag] = _.keys(properties).length;
      return ret;
    });
  }

  function removeStyleFromSelected(node, selector, style) {
    return apply(checkMatch(selector), function (node) {
      var ret = node;
      ret.css = objectDifference(node.css, style);
      return ret;
    })(node);
  }

  function consolidateSelectors(cssTree, allowedSelectors) {
    var consolidated, i, n = allowedSelectors.length, primeSelector;
    for (i = 0; i < n; i++) {
      consolidated = filterKeys(styleConsolidations(cssTree), allowedSelectors);
      primeSelector = _.keys(_.sortBy(selectorPropertyCount(consolidated), function (choice) {
        return -(_.values(choice)[0]);
      })[0])[0];
      renderStyle(primeSelector, consolidated[primeSelector]);
      cssTree = removeStyleFromSelected(cssTree, primeSelector, consolidated[primeSelector]);
    }
    return cssTree;
  }

  function onScriptsLoaded() {
    console.log("Lifting heritable styles...");
    var lifted = liftHeritable(computedCssTree($('body'))),
      selectors = selectorsUsed(lifted),
      tags = _.filter(selectors, function(s) { return s[0] !== '.'; }),
      classes = _.difference(selectors, tags);
    console.log("Stripping default styles...");
    stripDefaultStyles(lifted);
    console.log("Consolidating styles...");
    lifted = consolidateSelectors(lifted, tags);
    lifted = consolidateSelectors(lifted, classes);
  }

  ////////////////////////////////////////////////////////////////////////////////////////
  // Load jQuery and underscore then begin the fun.
  console.log("Loading required external scripts...");
  script        = document.createElement("script");
  script.src    = "https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js";
  script.onload = function () {
    jQuery.getScript(
      'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.3/underscore-min.js',
      onScriptsLoaded
    );
  };
  document.getElementsByTagName("head")[0].appendChild(script);
}());
