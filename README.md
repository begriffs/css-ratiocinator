![Logo](css-ratiocinator/raw/master/illustration/githubheader.png "Logo")

The CSS Ratiocinator automatically refactors your CSS and generates a
new stylesheet for your site. It works by examining your site's live
DOM in the browser and reverse engineering a new, more elegant, CSS
definition that captures styles down to the pixel.

It addresses the problem of old CSS whose styles accumulate and
contradict each other. After a certain point all CSS seems to grow only
by internal antagonism. The ratiocinator wipes the slate clean and
provides a harmonious new beginning.

## Usage

Runs best in [Google Chrome](//www.google.com/chrome).

1. Visit your page in Chrome.
1. Open the developer tools pane (by pressing ⌥⌘I)
1. Select the Javascript Console<br/>![JS Console](css-ratiocinator/raw/master/illustration/console.png "JS Console")
1. Paste the contents of `css.js` into the console and press enter.
1. If an error occurs, repeat the previous step. ([Issue #18](https://github.com/begriffs/css-ratiocinator/issues/18))
1. The new CSS will appear in the console.
1. (optionally) Feed output through [sass-convert](http://blog.derekperez.com/post/816063805/move-you-existing-stylebase-over-to-sass-or-scss)

## Mechanism

