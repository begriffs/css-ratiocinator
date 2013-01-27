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
    var styleData = node.data('style');
    if(typeof styleData === 'object') {
      _.each(_.keys(styleData), function (k) {
        if (k.substring(0, 7) === '-webkit') {
          delete styleData[k];
        }
      });
    }
    node.children().each(function () {
      stripWebkitStyles($(this));
    });
  }

  function stripDefaultStyles(node) {
    var defaults = {
      'alignment-baseline': 'auto',
      'background-attachment': 'scroll',
      'background-clip': 'border-box',
      'background-color': 'rgba(0, 0, 0, 0)',
      'background-image': 'none',
      'background-origin': 'padding-box',
      'background-position': '0% 0%',
      'background-repeat': 'repeat',
      'background-size': 'auto auto',
      'baseline-shift': 'baseline',
      'border-bottom-left-radius': '0px',
      'border-bottom-right-radius': '0px',
      'border-bottom-color': 'rgb(0, 0, 0)',
      'border-bottom-style': 'none',
      'border-bottom-width': '0px',
      'border-collapse': 'separate',
      'border-image-outset': '0px',
      'border-image-repeat': 'stretch',
      'border-image-slice': '100%',
      'border-image-source': 'none',
      'border-image-width': '1',
      'border-left-color': 'rgb(0, 0, 0)',
      'border-left-style': 'none',
      'border-left-width': '0px',
      'border-radius': '0px',
      'border-right-color': 'rgb(0, 0, 0)',
      'border-right-style': 'none',
      'border-right-width': '0px',
      'border-style': 'none',
      'border-top-left-radius': '0px',
      'border-top-right-radius': '0px',
      'border-top-color': 'rgb(0, 0, 0)',
      'border-top-style': 'none',
      'border-top-width': '0px',
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
      'flood-color': 'rgb(0, 0, 0)',
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
      'lighting-color': 'rgb(255, 255, 255)',
      'line-height': 'normal',
      'list-style-image': 'none',
      'list-style-position': 'outside',
      'margin': '0px',
      'margin-bottom': '0px',
      'margin-left': '0px',
      'margin-right': '0px',
      'margin-top': '0px',
      'marker-end': 'none',
      'marker-mid': 'none',
      'marker-start': 'none',
      'mask': 'none',
      'max-height': 'none',
      'max-width': 'none',
      'min-height': '0px',
      'min-width': '0px',
      'opacity': '1',
      'outline-style': 'none',
      'outline-width': '0px',
      'overflow': 'visible',
      'overflow-x': 'visible',
      'overflow-y': 'visible',
      'padding': node.prop("tagName").match(/[UO]L/) ? '' : '0px',
      'padding-bottom': '0px',
      'padding-left': node.prop("tagName").match(/[UO]L/) ? '40px' : '0px',
      'padding-right': '0px',
      'padding-top': '0px',
      'page-break-after': 'auto',
      'page-break-before': 'auto',
      'page-break-inside': 'auto',
      'pointer-events': 'auto',
      'position': 'static',
      'resize': 'none',
      'right': 'auto',
      'shape-rendering': 'auto',
      'stop-color': 'rgb(0, 0, 0)',
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
      'text-align': '-webkit-auto',
      'text-anchor': 'start',
      'text-decoration': 'none',
      'text-indent': '0px',
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
      'word-spacing': '0px',
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
        if (prop === defaults[def]) {
          delete node.data('style')[def];
        }
      });
    }
    node.children().each(function () {
      stripDefaultStyles($(this));
    });
  }

  function stripIrrelevantStyles(node) {
    var style = node.data('style');
    if (style) {
      if (node.prop("tagName") !== 'UL' && node.prop("tagName") !== 'OL') {
        delete style['list-style-type'];
      }

      // remove border-width default of 0px unless it matters
      if (!style['border-style'] &&
          !style['border-bottom-style'] &&
          !style['border-left-style'] &&
          !style['border-right-style'] &&
          style['border-width'] === '0px') {
        delete style['border-width'];
      }
    }
    node.children().each(function () {
      stripIrrelevantStyles($(this));
    });
  }

  // Heritable styles with default values are tricky. Strip them
  // from the root node only.
  function stripRootDefaultStyles(root) {
    var defaults = {speak: 'normal', visibility: 'visible', orphans: 2, widows: 2};
    root.data('style', objectDifference(root.data('style'), defaults));
  }

  function selectorsUsed(node, so_far) {
    so_far = so_far || {};
    so_far[node.prop("tagName")] = true;
    if (node.attr('class')) {
      _.each(node.attr('class').split(/\s+/), function (klass) {
        if (klass) {
          so_far['.' + klass] = true;
          so_far[node.prop("tagName") + '.' + klass] = true;
        }
      });
    }
    if (node.attr('id')) {
      so_far['#' + node.attr('id')] = true;
    }

    node.children().each(function () {
      selectorsUsed($(this), so_far);
    });
    return so_far;
  }

  function originatingSelectors(node, max_depth) {
    var escape_selector = function (sel) { return sel.replace(/(:)/g, '\\$1'); },
      selectors         = _.map(_.keys(selectorsUsed(node)), escape_selector),
      not_id            = function (selector) { return selector[0] !== '#'; },
      sub_selectors     = _.filter(selectors, not_id),
      build_selector    = function (tuple) { return tuple.join(' '); },
      add_if_matches    = function (selector) {
        if (node.find(selector).length) {
          selectors.push(selector);
        }
      };

    while (max_depth > 1) {
      _.each(
        _.map(
          cartesianProduct(selectors, sub_selectors),
          build_selector
        ),
        add_if_matches
      );
      max_depth -= 1;
    }
    return selectors;
  }

  function importance(root, choice) {
    var number = root.andSelf().find(choice.selector).length,
      size = _.keys(choice.style).length,
      selector_length = (choice.selector.match(/ /) || [1]).length,
      result = -(number * number * size);
    if (selector_length > 1) {
      result += 1; // favor shallow selectors
    }
    return result;
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

  // This function makes the page look weird unless other elements are measured with ems as well
  function fontsToEm(root, base_size) {
    _.each(['font-size', 'line-height'], function (prop, i) {
      var match, val;

      val = $(root).data('style')[prop];
      if (val) {
        match = val.match(/px$/);
        if (match) {
          root.data('style')[prop] = parseFloat((val.match(/\d+/)[0] / base_size).toFixed(3)) + 'em';
        }
      }
    });

    root.children().each(function () {
      fontsToEm($(this), base_size);
    });
  }

  window.simplerStyle = function (root) {
    root = root || $('body');

    var selectors = {}, common, best, result = {},
      selectorWithCommonStyle = function (sel) {
        return { selector: sel, style: commonStyle(root.andSelf().find(sel)) };
      },
      localImportance = function (sel) {
        return importance(root, sel);
      },
      markImportance = function (sel) {
        sel.importance = localImportance(sel);
        return sel;
      },
      irrelevant = function (sel) {
        return localImportance(sel) === 0;
      },
      removeStyle = function (style) {
        return function (i, elt) {
          $(elt).data('style', objectDifference($(elt).data('style'), style));
        };
      };

    console.log("/* Computing styles... */");
    root.find('*').andSelf().each(function (i, elt) {
      $(elt).data('style', abbreviate(computedCssProperties(elt)));
    });

    console.log("/* Lifting heritable styles... */");
    liftHeritable(root);

    console.log("/* Stripping default styles... */");
    stripDefaultStyles(root);
    stripIrrelevantStyles(root);
    stripWebkitStyles(root);
    stripRootDefaultStyles(root);

    // Experimental: uncomment to convert font sizes and line heights to ems
    // fontsToEm(root, root.data('style')['font-size'].match(/\d+/)[0]);

    console.log("/* Consolidating styles... */\n");
    selectors = originatingSelectors(root, 2);
    while (!_.isEmpty(selectors)) {
      common = _.map(_.map(selectors, selectorWithCommonStyle), markImportance);
      best   = _.sortBy(common, 'importance')[0];
      if (!_.isEmpty(best.style)) {
        result[best.selector] = best.style;
        root.find(best.selector).each(removeStyle(best.style));
      }
      selectors = _.without(selectors, best.selector);
      selectors = _.difference(selectors, _.pluck(_.filter(common, irrelevant), 'selector'));
    }
    return result;
  };

  window.renderStyle = function (selector, properties) {
    var css = '';
    if (!_.isEmpty(properties)) {
      css += (selector + " {\n");
      _.each(properties, function (val, key) {
        css += ("\t" + key + ': ' + val + ";\n");
      });
      css += "}\n";
    }
    return css;
  };
}());
