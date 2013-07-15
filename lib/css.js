/* global exports, require, jQuery, OBJ, CSSFontFaceRule */
/* exported CSS */

if (typeof require !== 'undefined') {
  var _ = require('../vendor/underscore-1.4.2.js'),
    $   = require('../vendor/jquery-1.8.2.js');
} else {
  var $ = jQuery.noConflict();
}

var CSS = (function () {
  'use strict';
  var my = {};

  function computedCssProperties(elt, pseudoclass) {
    var result = {}, i, j, prop, val,
      rules = window.getMatchedCSSRules(elt, pseudoclass),
      camelize = function (s) {
        return s.replace(
          /-([a-z])/g,
          function (g) { return g[1].toUpperCase(); }
        );
      };

    // dealing with "array-like" objects so cannot use underscore
    if (rules) {
      for (i = 0; i < rules.length; i += 1) {
        for (j = rules[i].style.length - 1; j >= 0; j -= 1) {
          prop = rules[i].style[j];
          val = rules[i].style[camelize(prop)];
          if (val !== 'initial') {
            result[prop] = val;
          }
        }
      }
    }
    return result;
  }

  function commonStyle(nodes) {
    return OBJ.intersection(_.map(nodes, function (k) { return $(k).data('style') || {}; }));
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
      'speak', 'speech-rate', 'stress', 'visibility', 'voice-family', 'volume', 'widows'
    ];

    node.children().each(function (i, kid) {
      var common = _.pick(commonStyle([node, $(kid)]), heritable);
      $(kid).data('style', OBJ.difference($(kid).data('style'), common));
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
    if (typeof styleData === 'object') {
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
      'padding': node.prop('tagName').match(/[UO]L/) ? '' : '0px',
      'padding-bottom': '0px',
      'padding-left': node.prop('tagName').match(/[UO]L/) ? '40px' : '0px',
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
      if (defaultDisplayForTag(node.prop('tagName')) === node.data('style').display) {
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
    root.data('style', OBJ.difference(root.data('style'), defaults));
  }

  function selectorsUsed(node, soFar) {
    var tag = node.prop('tagName').toLowerCase();
    if (tag === 'head' || tag === 'script') {
      return {};
    }
    soFar = soFar || {};
    soFar[tag] = true;
    if (tag !== 'html') { // disregard classes on root element
      if (node.attr('class')) {
        _.each(node.attr('class').split(/\s+/), function (klass) {
          if (klass) {
            soFar['.' + klass] = true;
            soFar[node.prop('tagName').toLowerCase() + '.' + klass] = true;
          }
        });
      }
      if (node.attr('id')) {
        soFar['#' + node.attr('id')] = true;
      }
    }
    node.children().each(function () {
      selectorsUsed($(this), soFar);
    });
    return soFar;
  }

  function originatingSelectors(node, maxDepth) {
    var escapeSelector = function (sel) { return sel.replace(/([:%])/g, '\\$1'); },
      selectors         = _.map(_.keys(selectorsUsed(node)), escapeSelector),
      notId            = function (selector) { return selector[0] !== '#'; },
      subSelectors     = _.filter(selectors, notId),
      buildSelector    = function (tuple) { return tuple.join(' '); },
      addIfMatches    = function (selector) {
        if (node.find(selector).length) {
          selectors.push(selector);
        }
      };

    while (maxDepth > 1) {
      _.each(
        _.map(
          OBJ.cartesianProduct(selectors, subSelectors),
          buildSelector
        ),
        addIfMatches
      );
      maxDepth -= 1;
    }
    return selectors;
  }

  function importance(root, choice) {
    var number = root.andSelf().find(choice.selector).length,
      size = _.keys(choice.style).length,
      selectorLength = (choice.selector.match(/ /) || [1]).length,
      result = -(number * number * size);
    if (selectorLength > 1) {
      result += 1; // favor shallow selectors
    }
    return result;
  }

  function abbreviate(style) {
    // combine directional styles if possible
    _.each(
      [
        'border-TRBL-color', 'border-TRBL-style', 'border-TRBL-width',
        'padding-TRBL', 'margin-TRBL', 'border-TB-LR-radius', 'overflow-XY',
        'background-repeat-XY'
      ],
      function (template) {
        var group, values = [];
        if (template.match(/TRBL/)) {
          group = _.map(['top', 'right', 'bottom', 'left'], function (direction) {
            return template.replace('TRBL', direction);
          });
        } else if (template.match(/TB-LR/)) {
          group = _.map(
            OBJ.cartesianProduct(['top', 'bottom'], ['left', 'right']),
            function (pair) {
              return template.replace('TB', pair[0]).replace('LR', pair[1]);
            }
          );
        } else {
          group = _.map(['x', 'y'], function (direction) {
            return template.replace('XY', direction);
          });
        }
        _.each(group, function (prop) {
          if (style[prop] !== undefined) {
            values.push(style[prop]);
          }
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

  my.fontsUsed = function (node, soFar) {
    var fonts = node.data('style')['font-family'];
    soFar = soFar || {};
    if (fonts) {
      _.each(fonts.split(', '), function (font) {
        soFar[font] = true;
      });
    }
    node.children().each(function () {
      my.fontsUsed($(this), soFar);
    });
    return soFar;
  };

  my.mediaBreakpoints = function () {
    var inclusivity = [],
      points = _.reduce(
        my.mediaQueries(),
        function (list, q) {
          return list.concat(_.compact(
            _.map(
              ['min-width', 'max-width'],
              function (prop) {
                var found = +(q.match(prop + '\\s*:\\s*(\\d+)') || [])[1];
                if (found) { // side-effect of map
                  if (_.isUndefined(inclusivity[found])) { inclusivity[found] = {}; }
                  inclusivity[found][(prop === 'max-width') ? 'left' : 'right'] = true;
                }
                return found;
              }
            )
          ));
        },
        [0]
      );
    inclusivity[0]        = {right: true};
    inclusivity[Infinity] = {left: true};
    return {
      points: _.uniq(points.sort(function (a, b) { return a - b; }), true),
      inclusivity: inclusivity
    };
  };

  my.fontDeclarations = function () {
    $('html').find('*').andSelf().each(function (i, elt) {
      $(elt).data('style', abbreviate(computedCssProperties(elt)));
    });
    var cssRules = _.flatten(_.map(_.pluck(document.styleSheets, 'cssRules'), _.toArray)),
      fontRules = _.filter(cssRules, function (r) { return r.constructor === CSSFontFaceRule; });
    return _.pluck(fontRules, 'cssText'); // TODO: filter by fontsUsed()
  };

  my.simplerStyle = function (root) {
    root = root || $('html');

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
          $(elt).data('style', OBJ.difference($(elt).data('style'), style));
        };
      };

    /* Computing styles... */
    root.find('*').andSelf().each(function (i, elt) {
      $(elt).data('style', abbreviate(computedCssProperties(elt)));
    });

    /* Lifting heritable styles... */
    liftHeritable(root);

    /* Stripping default styles... */
    stripDefaultStyles(root);
    stripIrrelevantStyles(root);
    stripWebkitStyles(root);
    stripRootDefaultStyles(root);

    /* Consolidating styles... */
    selectors = originatingSelectors(root, 2).concat(['*']);
    while (!_.isEmpty(selectors)) {
      common = _.map(_.map(selectors, selectorWithCommonStyle), markImportance);
      best   = _.sortBy(common, 'importance')[0];
      if (!_.isEmpty(best.style)) {
        result[best.selector] = best.style;
        root.andSelf().find(best.selector).each(removeStyle(best.style));
      }
      selectors = _.without(selectors, best.selector);
      selectors = _.difference(selectors, _.pluck(_.filter(common, irrelevant), 'selector'));
    }
    return result;
  };

  my.renderStyle = function (properties, selector, indentLevel) {
    var css = '', pad = '';
    _(indentLevel || 0).times(function () { pad += '\t'; });

    if (!_.isEmpty(properties)) {
      css += (pad + selector + ' {\n');
      _.each(properties, function (val, key) {
        css += (pad + '\t' + key + ': ' + val + ';\n');
      });
      css += (pad + '}\n');
    }
    return css;
  };

  my.mediaQueries = function () {
    return _.pluck(
      _.flatten(_.map(
        _.pluck(document.styleSheets, 'cssRules'),
        function (rule) {
          return _.compact(_.pluck(rule, 'media'));
        }
      )),
      'mediaText'
    );
  };

  my.mediaWidthIntervals = function () {
    var breaks  = my.mediaBreakpoints(),
      intervals = _.filter(
        _.zip(breaks.points, breaks.points.slice(1).concat([Infinity])),
        function (I) { return I[1] - I[0] > 1; }
      );
    return _.map(
      intervals,
      function (I) {
        var min = I[0], max = I[1];
        return {
          min:    breaks.inclusivity[min].right ? min : min + 1,
          max:    breaks.inclusivity[max].left  ? max : max - 1,
          sample: max !== Infinity ? min + Math.round((max - min) / 2) : min + 1
        };
      }
    );
  };

  if (typeof exports !== 'undefined') {
    _.extend(exports, my);
  }
  return my;
}());
