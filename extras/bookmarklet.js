var el = document.createElement('div');
var b = document.getElementsByTagName('body')[0];
var otherLib = false;
var msg = '';

var jQueryUri = 'http://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.2/jquery.min.js';
var underscoreUri = 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.2/underscore-min.js';
var ratioUri = 'https://raw.github.com/begriffs/css-ratiocinator/master/lib/css.js';

var getScript = function(url) {
  var script = document.createElement('script');
  script.src = url;
  var head = document.getElementsByTagName('head')[0],
  done = false;
  script.onload = script.onreadystatechange = function () {
    if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
      done = true;
      script.onload = script.onreadystatechange = null;
      head.removeChild(script);
    }
  };
  head.appendChild(script);
}

var showMsg = function() {
  el.innerHTML = msg;
  b.appendChild(el);
  window.setTimeout(function () {
      b.removeChild(el);
  }, 2500);
}

el.style.position='fixed';
el.style.width='320px';
el.style.marginLeft='-110px';
el.style.top='0';
el.style.left='50%';
el.style.padding='5px%2010px';
el.style.zIndex=1001;
el.style.font='16px Helvetica,arial,serif';
el.style.color='#222';
el.style.backgroundColor = '#D1EEEE';

if (typeof $ == 'function') {
  otherlib = true;
}

if (typeof jQuery == 'undefined') {
  getScript(jQueryUri);
  msg += '<p>This page is now jQuerified with v' + jQuery.fn.jquery + '</p>';
} else {
  msg = '<p>This page already using jQuery</p>';
};

if (typeof _ == 'undefined') {
  getScript(underscoreUri);
  msg += '<p>This page is now Underscored with v' + _.VERSION + '</p>';
} else {
  msg += '<p>This page already using Underscore</p>';
}

if (typeof simplerStyle == 'undefined') {
  getScript(ratioUri);
  msg += '<p>Loaded Ratiocinator. Reticulating splines...</p>';
} else {
  msg += '<p>This page already has Ratiocinator loaded</p>';
}

if (msg.length > 0) { showMsg(); };
