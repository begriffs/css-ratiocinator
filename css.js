/*jslint browser: true, indent: 2, nomen: true, plusplus: true */
/*global _: true */
/*global $: true */

(function () {
  "use strict";

  function repeated(f) {
    return function (ary) {
      if (ary.length === 0) { return []; }
      var seed = ary.pop();
      return _.reduce(ary, function (memo, obj) { return f(memo, obj); }, seed);
    };
  }

  var script,
    intersect = repeated(function (a, b) {
      var x, c = {};
      for (x in a) {
        if (a.hasOwnProperty(x) && b.hasOwnProperty(x) && _.isEqual(a[x], b[x])) {
          c[x] = a[x];
        }
      }
      return c;
    });

  script = document.createElement("script");
  script.setAttribute("src", "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.3/underscore-min.js");
  document.getElementsByTagName("head")[0].appendChild(script);

  script = document.createElement("script");
  script.setAttribute("src", "//code.jquery.com/jquery.min.js");
  document.getElementsByTagName("head")[0].appendChild(script);

  function computedCss(dom) {
    var ret = {}, prop,
      style = window.getComputedStyle ? window.getComputedStyle(dom, null) : dom.currentStyle;
    for (prop in style) {
      if (style.hasOwnProperty(prop)) {
        ret[prop] = style.getPropertyValue(prop);
      }
    }
    return ret;
  }

  function difference(a, b) {
    var x, c = {};

    if (!a || !b) { return {}; }
    for (x in a) {
      if (a.hasOwnProperty(x) && !b.hasOwnProperty(x)) {
        c[x] = a[x];
      }
    }
    return c;
  }

  function consolidate(snode) {
    var newkids = _.map(snode.children, consolidate),
      common = intersect(_.map(newkids, function (k) { return k.css; })),
      i;
    for (i = 0; i < newkids.length; i++) {
      newkids[i].css = difference(newkids[i].css, common);
    }
    $.extend(snode.css, common);
    return {
      tag: snode.tag,
      klass: snode.klass,
      id: snode.id,
      css: snode.css,
      children: newkids
    };
  }

  function shadowDom(elt) {
    return {
      tag: elt[0].tagName,
      klass: elt.attr('class'),
      id: elt.attr('id'),
      css: computedCss(elt[0]),
      children: _.map(elt.children(), function (c) { return shadowDom($(c)); })
    };
  }

  function renderStylesheet(snode, path) {
    var result = "",
      hasAttrs = false,
      block    = path + " {\n",
      attr,
      i,
      c,
      seen     = {},
      classy   = function (snode) {
        var x = snode.tag;
        if (snode.id) {
          x = "#" + snode.id;
        } else if (snode.klass) {
          x += "." + snode.klass.split(' ').join('.');
        }
        return x;
      },
      relative = function (snode, path) {
        return snode.id ? classy(snode) : path + ' > ' + classy(snode);
      };

    for (attr in snode.css) {
      if (snode.css.hasOwnProperty(attr)) {
        block += "\t" + attr + ': ' + snode.css[attr] + ";\n";
        hasAttrs = true;
      }
    }
    block += "}\n\n";
    if (hasAttrs) {
      result += block;
    }

    for (i = 0; i < snode.children.length; i++) {
      c = relative(snode.children[i], path);
      if (!seen.hasOwnProperty(c)) {
        seen[c] = true;
        result += renderStylesheet(snode.children[i], c);
      }
    }
    return result;
  }

  return renderStylesheet(consolidate(shadowDom($('body'))), 'body');
}());
