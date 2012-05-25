script = document.createElement("script");
script.setAttribute("src", "http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.3/underscore-min.js");
document.getElementsByTagName("head")[0].appendChild(script);

script = document.createElement("script");
script.setAttribute("src", "http://code.jquery.com/jquery.min.js");
document.getElementsByTagName("head")[0].appendChild(script);

function computedCss(dom) {
  var style;
  var returns = {};
  if(window.getComputedStyle){
    var camelize = function(a,b){
      return b.toUpperCase();
    };
    style = window.getComputedStyle(dom, null);
    for(var i = 0, l = style.length; i < l; i++){
      var prop = style[i];
      var camel = prop.replace(/\-([a-z])/g, camelize);
      var val = style.getPropertyValue(prop);
      returns[camel] = val;
    };
    return returns;
  };
  if(style = dom.currentStyle){
    for(var prop in style){
      returns[prop] = style[prop];
    };
    return returns;
  };
  return this.css();
}

function repeated(f) {
  return function(ary) {
    if(ary.length == 0) { return [] };
    var seed = ary.pop();
    return _.reduce(ary, function(memo, obj) { return f(memo, obj) }, seed);
  }
}

var intersect = repeated(function(a,b){
  c = {};
  for(x in a) {
    if(x in b && _.isEqual(a[x], b[x]) ) {
      c[x] = a[x];
    }
  }
  return c;
});

function difference(a, b) {
  if(!a || !b) { return {}; }
  c = {};
  for(x in a) {
    if(!(x in b)) {
      c[x] = a[x];
    }
  }
  return c;
}

function consolidate(snode) {
  newkids = _.map(snode.children, consolidate);
  common  = intersect(_.map(newkids, function(k) { return k.css } ));
  for(i in newkids) {
    newkids[i].css = difference(newkids[i].css, common);
  }
  jQuery.extend(snode.css, common);
  return {
    tag: snode.tag,
    class: snode.class,
    id: snode.id,
    css: snode.css,
    children: newkids
  }
}

function shadowDom(elt) {
  var kids = elt.children();
  return {
    tag: elt[0].tagName,
    class: elt.attr('class'),
    id: elt.attr('id'),
    css: computedCss(elt[0]),
    children: _.map(elt.children(), function(c){ return shadowDom($(c)) })
  }
}

function renderStylesheet(snode, path) {
  var result = "";
  var hasAttrs = false;
  var block = path + " {\n";
  for(attr in snode.css) {
    block += "\t" + attr + ': ' + snode.css[attr] + ";\n";
    hasAttrs = true;
  }
  block += "}\n\n";
  if(hasAttrs) {
    result += block;
  }

  var classy   = function(snode) {
    var x = snode.tag;
    if(snode.id) {
      x += "#" + snode.id;
    } else if(snode.class) {
      x += "." + snode.class.split(' ').join('.');
    }
    return x;
  }
  var relative = function(snode, path) {
    return snode.id ? classy(snode) : path + ' > ' + classy(snode);
  }

  var seen = {};
  for(i in snode.children) {
    var c = relative(snode.children[i], path);
    if(! (c in seen)) {
      seen[c] = true;
      result += renderStylesheet(snode.children[i], c);
    }
  }
  return result;
}

renderStylesheet(consolidate(shadowDom($('body'))), 'body');
