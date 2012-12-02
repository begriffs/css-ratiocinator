var msgs = document.createElement('div');
var b = document.getElementsByTagName('body')[0];
var otherLib = false;
var msg = '';
var styles = {};

var jQueryUri = 'http://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.2/jquery.min.js';
var underscoreUri = 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.2/underscore-min.js';
var ratioUri = 'https://raw.github.com/begriffs/css-ratiocinator/master/lib/css.js';

var getScript = function (url, success) {
  var script = document.createElement('script'),
    head = document.getElementsByTagName('head')[0],
    done = false;
  script.src = url;

  script.onload = script.onreadystatechange = function () {
    if (!done && (!this.readyState || this.readyState === 'complete')) {
      done = true;
      success();
      script.onload = script.onreadystatechange = null;
      head.removeChild(script);
    }
  };
  head.appendChild(script);
  console.log(script);
};

var showMsg = function () {
  msgs.innerHTML = msg;
  b.appendChild(msgs);
  window.setTimeout(function () { b.removeChild(msgs); }, 2500);
};

msgs.style.position = 'fixed';
msgs.style.width = '320px';
msgs.style.marginLeft = '-110px';
msgs.style.top = '0';
msgs.style.left = '50%';
msgs.style.padding = '5px%2010px';
msgs.style.zIndex = 1001;
msgs.style.font = '16px Helvetica,arial,serif';
msgs.style.color = '#222';
msgs.style.backgroundColor = '#D1EEEE';

if (typeof jQuery == 'undefined') {
  getScript(jQueryUri, function () { msg += '<p>jQuery loaded</p>'; });
} else {
  msg = '<p>This page already using jQuery v' + jQuery.fn.jquery + '</p>';
}

if (typeof _ == 'undefined') {
  getScript(underscoreUri, function () { msg += '<p>Underscore loaded</p>'; });
} else {
  msg += '<p>This page already using Underscore v' + _.VERSION + '</p>';
}

if (typeof simplerStyle == 'undefined') {
  getScript(ratioUri, function () {
    styles = window.simplerStyle();
    msgs += 'Loaded Ratiocinator';
  });
} else {
  msg += '<p>This page already has Ratiocinator loaded</p>';
}

if (msg.length > 0) { showMsg(); }

console.log(msg);
console.log(styles);
