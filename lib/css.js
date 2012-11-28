/*jslint browser: true, indent: 2, nomen: true */
/*global _, jQuery, console */

(function () {
  "use strict";

  var $ = jQuery.noConflict();

  function computedCssProperties(elt, pseudoclass) {
    var style = window.getComputedStyle(elt, pseudoclass || null), result = {};
    _.each(style, function (p) {
      result[p] = style.getPropertyValue(p);
    });
    return result;
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
    return objectIntersection(_.map(nodes, function (k) { return $(k).data('style') || {}; }));
  }

  function liftHeritable(node) {
    node.children().each(function () { liftHeritable($(this)); });

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
      var common = filterKeys(commonStyle([node, $(kid)]), heritable);
      $(kid).data('style', objectDifference($(kid).data('style'), common));
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

  function stripWebkitStyles(node) {
    _.each(_.keys(node.data('style')), function (k) {
      if (k.substring(0, 7) === '-webkit') {
        delete node.data('style')[k];
      }
    });
    node.children().each(function () {
      stripWebkitStyles($(this));
    });
  }

  function stripDefaultStyles(node) {
    var defaults = {
      'alignment-baseline': 'auto',
      'background-attachment': 'scroll',
      'background-clip': 'border-box',
      'background-color': 'rgba\\(0, 0, 0, 0\\)',
      'background-image': 'none',
      'background-origin': 'padding-box',
      'background-position': '0% 0%',
      'background-repeat': 'repeat',
      'background-size': 'auto auto',
      'baseline-shift': 'baseline',
      'border-bottom-left-radius': '^0px$',
      'border-bottom-right-radius': '^0px$',
      'border-bottom-color': 'rgb\\(0, 0, 0\\)',
      'border-bottom-style': 'none',
      'border-bottom-width': '^0px$',
      'border-collapse': 'separate',
      'border-left-color': 'rgb\\(0, 0, 0\\)',
      'border-left-style': 'none',
      'border-left-width': '^0px$',
      'border-radius': '^0px$',
      'border-right-color': 'rgb\\(0, 0, 0\\)',
      'border-right-style': 'none',
      'border-right-width': '^0px$',
      'border-style': 'none',
      'border-top-left-radius': '^0px$',
      'border-top-right-radius': '^0px$',
      'border-top-color': 'rgb\\(0, 0, 0\\)',
      'border-top-style': 'none',
      'border-top-width': '^0px$',
      'border-width': '^0px$',
      'bottom': 'auto',
      'box-shadow': 'none',
      'box-sizing': 'content-box',
      'caption-side': 'top',
      'clear': 'none',
      'clip': 'auto',
      'clip-path': 'none',
      'clip-rule': 'nonzero',
      'color-interpolation': 'srgb',
      'color-interpolation-filters': 'linearrgb',
      'color-rendering': 'auto',
      'cursor': 'auto',
      'direction': 'ltr',
      'dominant-baseline': 'auto',
      'empty-cells': 'show',
      'fill': '#000000',
      'fill-opacity': '1',
      'fill-rule': 'nonzero',
      'filter': 'none',
      'float': 'none',
      'flood-color': 'rgb\\(0, 0, 0\\)',
      'flood-opacity': '1',
      'font-style': 'normal',
      'font-variant': 'normal',
      'font-weight': 'normal',
      'glyph-orientation-horizontal': '0deg',
      'glyph-orientation-vertical': 'auto',
      'image-rendering': 'auto',
      'kerning': '0',
      'left': 'auto',
      'letter-spacing': 'normal',
      'lighting-color': 'rgb\\(255, 255, 255\\)',
      'line-height': 'normal',
      'list-style-image': 'none',
      'list-style-position': 'outside',
      'margin': '^0px$',
      'margin-bottom': '^0px$',
      'margin-left': '^0px$',
      'margin-right': '^0px$',
      'margin-top': '^0px$',
      'marker-end': 'none',
      'marker-mid': 'none',
      'marker-start': 'none',
      'mask': 'none',
      'max-height': 'none',
      'max-width': 'none',
      'min-height': '^0px$',
      'min-width': '^0px$',
      'opacity': '1',
      'outline-style': 'none',
      'outline-width': '^0px$',
      'overflow': 'visible',
      'overflow-x': 'visible',
      'overflow-y': 'visible',
      'padding': '^0px$',
      'padding-bottom': '^0px$',
      'padding-left': '^0px$',
      'padding-right': '^0px$',
      'padding-top': '^0px$',
      'page-break-after': 'auto',
      'page-break-before': 'auto',
      'page-break-inside': 'auto',
      'pointer-events': 'auto',
      'position': 'static',
      'resize': 'none',
      'right': 'auto',
      'shape-rendering': 'auto',
      'stop-color': 'rgb\\(0, 0, 0\\)',
      'stop-opacity': '1',
      'stroke': 'none',
      'stroke-dasharray': 'none',
      'stroke-dashoffset': '0',
      'stroke-linecap': 'butt',
      'stroke-linejoin': 'miter',
      'stroke-miterlimit': '4',
      'stroke-opacity': '1',
      'stroke-width': '1',
      'table-layout': 'auto',
      'text-align': 'left|auto',
      'text-anchor': 'start',
      'text-decoration': 'none',
      'text-indent': '^0px$',
      'text-overflow': 'clip',
      'text-rendering': 'auto',
      'text-shadow': 'none',
      'text-transform': 'none',
      'top': 'auto',
      'unicode-bidi': 'normal',
      'vector-effect': 'none',
      'vertical-align': 'baseline',
      'white-space': 'normal',
      'word-break': 'normal',
      'word-spacing': '^0px$',
      'word-wrap': 'normal',
      'writing-mode': 'lr-tb',
      'z-index': 'auto',
      'zoom': '1'
    };

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
      stripDefaultStyles($(this));
    });
  }

  function stripIrrelevantStyles(node) {
    if (node.data('style')) {
      if (node.prop("tagName") !== 'UL' && node.prop("tagName") !== 'OL') {
        delete node.data('style')['list-style-type'];
      }

      // Currently treat width and and height as irrelevant until comprehensive
      // tests indicate when they should be included. Generally they're
      // incedental in the computed style.
      delete node.data('style').width;
      delete node.data('style').height;
    }
    node.children().each(function () {
      stripIrrelevantStyles($(this));
    });
  }

  // Heritable styles with default values are tricky. Strip them
  // from the root node only.
  function stripRootDefaultStyles(root) {
    var defaults = {speak: 'normal', visibility: 'visible', orphans: 2, widows: 2};
    root.data('style',
      objectDifference(root.data('style'), defaults)
    );
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
        kid_selectors = originatingSelectors($(this), depth - 1);
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

  function importance(choice) {
    return -(_.keys(choice.style).length * $('html').find(choice.selector).length);
  }

  function abbreviate(style) {
    // combine directional styles if possible
    _.each(
      [
        'border-TRBL-color', 'border-TRBL-style', 'border-TRBL-width',
        'padding-TRBL', 'margin-TRBL', 'border-TB-LR-radius', 'overflow-XY'
      ],
      function (template) {
        var group, values = [];
        if (template.match(/TRBL/)) {
          group = _.map(['top', 'right', 'bottom', 'left'], function (direction) {
            return template.replace('TRBL', direction);
          });
        } else if (template.match(/TB-LR/)) {
          group = _.map(cartesianProduct(['top', 'bottom'], ['left', 'right']), function (pair) {
            return template.replace('TB', pair[0]).replace('LR', pair[1]);
          });
        } else {
          group = _.map(['x', 'y'], function (direction) {
            return template.replace('XY', direction);
          });
        }
        _.each(group, function (prop) {
          values.push(style[prop]);
        });
        if (_.uniq(values).length === 1) { // if all directions agree
          _.each(group, function (prop) { // then erase the directional properties
            delete style[prop];
          });
          style[template.replace(/-TRBL|TB-LR-|-XY/, '')] = values.pop();
        }
      }
    );

    // remove superfluous style
    if (!_.has(style, 'outline-style') || style['outline-style'] === 'none') {
      delete style['outline-color'];
    }
    if (!_.has(style, 'border-style') || style['border-style'] === 'none') {
      delete style['border-color'];
    }
    return style;
  }

  window.simplerStyle = function () {
    var root = $('body'), selectors = {}, common, best, result = {},
      selectorWithCommonStyle = function (sel) {
        return { selector: sel, style: commonStyle($('html').find(sel)) };
      },
      removeStyle = function (style) {
        return function (i, elt) {
          $(elt).data('style', objectDifference($(elt).data('style'), style));
        };
      };

    console.log("Computing styles...");
    $('BODY, BODY *').each(function (i, elt) {
      $(elt).data('style', abbreviate(computedCssProperties(elt)));
    });

    console.log("Lifting heritable styles...");
    liftHeritable(root);

    console.log("Stripping default styles...");
    stripWebkitStyles(root);
    stripDefaultStyles(root);
    stripIrrelevantStyles(root);
    stripRootDefaultStyles(root);

    console.log("Consolidating styles...\n");
    $('BODY, BODY *').each(function (i, elt) {
      _.each([1, 2], function (depth) {
        $.extend(selectors, originatingSelectors($(elt), depth));
      });
    });
    while (!_.isEmpty(selectors)) {
      common = _.map(_.keys(selectors), selectorWithCommonStyle);
      best   = _.sortBy(common, importance)[0];
      if (!_.isEmpty(best.style)) {
        result[best.selector] = best.style;
        $(best.selector).each(removeStyle(best.style));
      }
      delete selectors[best.selector];
    }
    return result;
  };

  window.renderStyle = function (selector, properties) {
    if (!_.isEmpty(properties)) {
      console.log(selector + ' {');
      _.each(properties, function (val, key) {
        console.log("\t" + key + ': ' + val + ';');
      });
      console.log('}');
    }
  };
}());
