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

function consolidate(node) {
  newkids = _.map(node.children, consolidate);
  common  = intersect(_.map(newkids, function(k) { return k.css } ));
  for(i in newkids) {
    newkids[i].css = difference(newkids[i].css, common);
  }
  jQuery.extend(node.css, common);
  return {
    tag: node.tag,
    class: node.class,
    id: node.id,
    css: node.css,
    children: newkids
  }
}

var filterCss = function(snode, filterFunc) {
  snode.css = _.select(snode.css, filterFunc);
  for(i in snode.children) {
    filterCss(snode.children[i], filterFunc);
  }
};

function removeWebkitCss(cssItem) {
  return !cssItem.substring(0, "webkit".length) === "Webkit";
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
