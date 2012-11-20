![Logo](css-ratiocinator/raw/master/illustration/githubheader.png "Logo")

The CSS Ratiocinator automatically refactors your CSS and generates a
new stylesheet for your site. It works by examining your site's live DOM
in the browser and reverse engineering a new, more elegant definition
that captures styles down to the pixel.

It addresses the problem of old CSS whose styles accumulate and
contradict each other. After a certain point all CSS seems to grow only
by internal antagonism. The Ratiocinator wipes the slate clean and
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

The ratiocinator proceeds in two phases: assessment and consolidation.
During assessment it determines which nodes will need which styles,
accounting for browser defaults and cascade rules. The browser provides
a full list of computed style for every node, and our first step is to
prune redundencies from cascaded style in a depth-first process called
"lifting." ![Lifting](css-ratiocinator/raw/master/illustration/lift.png "Lifting")

The last step in assessment is stripping default styles. The final
style needn't specify CSS defaults, so we remove them prior to the
consolidation phase.

Next comes consolidation, where we find shared pieces of style
throughout the cleaned DOM tree and extract them to CSS declarations.

![Consolidating](css-ratiocinator/raw/master/illustration/consolidate.png "Consolidating")

In the diagram above, the ratiocinator will choose to output a
declaration for the styles in red before those in blue. Although there
are more blue items than red in element `aside.foo`, there are more red
elements overall. The red has greater "volume." Hence the ratiocinator
will extract styles for all elements with class `foo` first and then for
`aside` elements second.

## Contributing

This software is still very much in development. Pull requests are
welcome; please consult the open [issues](css-ratiocinator/issues) for
ideas. In general, the current todos fall into these groups:

1. Create a test suite and write tests
1. Try code on real sites and find errors
1. Allow software to be run from the command line
1. Accomodate states (e.g. :hover) and resizing
1. Invent new ways to improve CSS
1. Define measurements to assess improvement

## License

The CSS Ratiocinator is Copyright © 2012 Joe Nelson. It is free
software, and may be redistributed under the terms specified in the
LICENSE file.
