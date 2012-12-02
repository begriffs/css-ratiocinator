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

This program runs from the command line using the PhantomJS headless
browser.

1. Install [PhantomJS](http://phantomjs.org/)
1. Clone this repo
1. In the cloned directory, run `phantomjs ratiocinate.js [URL]`
1. The new CSS will appear.
1. (optionally) Feed output through [sass-convert](http://blog.derekperez.com/post/816063805/move-you-existing-stylebase-over-to-sass-or-scss)

## Faq

<dl>
  <dt>Does this thing clobber or remove my styles?</dt>
  <dd>No. If your page renders differently after using
  Ratiocinator-generated style then that's a bug. This software may move
  styles around during the assessment stage of its algorithm but the
  end result respects the original styles you have created. Note that it
  may achieve these styles using a different combination of selectors
  and inheritance than your original CSS did.</dd>

  <dt>Can it work on a whole site (multiple pages)?</dt>
  <dd>In principle yes, but not yet. The strategy will be to ajax the
  pages together into a single page with multiple body tags. This long
  assembled page will provide enough data to the Ratiocinator to create
  a new style that respects everything your site does.</dd>

  <dt>How is this different from other CSS tidying programs?</dt>
  <dd>The Ratiocinator does not read your CSS files at all, it ignores
  them completely. It relies on the live DOM to infer what your styles
  want to accomplish. The thoroughness of the results you get are based
  on the quality and completeness of the example DOM that you provide the
  program.</dd>

  <dt>Does it capture styles for the "sad path?"</dt>
  <dd>It captures styles for whatever you show it, so if you have styles
  for errors or form validation problems or various element states
  then you'll need to include the markup to demonstrate them. The most
  effective input is a living style guide for your site. You do use a
  style guide, don't you?</dd>
</dl>

## Mechanism

The Ratiocinator proceeds in two phases: assessment and consolidation.
During assessment it determines which nodes will need which styles,
accounting for browser defaults and cascade rules. The browser provides
a full list of computed style for every node, and our first step is to
prune redundancies from cascaded style in a depth-first process called
"lifting."

![Lifting](css-ratiocinator/raw/master/illustration/lift.png "Lifting")

The last step in assessment is stripping default styles. The final
style needn't specify CSS defaults, so we remove them prior to the
consolidation phase.

Next comes consolidation, where we find shared pieces of style
throughout the cleaned DOM tree and extract them to CSS declarations.

![Consolidating](css-ratiocinator/raw/master/illustration/consolidate.png "Consolidating")

In the diagram above, the Ratiocinator will choose to output a
declaration for the styles in red before those in blue. Although there
are more blue items than red in element `aside.foo`, there are more red
elements overall. The red has greater "volume." Hence the Ratiocinator
will extract styles for all elements with class `foo` first and then for
`aside` elements second.

## Bookmarklet

The Ratiocinator can also be run from your browser as a bookmarklet:

    javascript:(function%20()%20%7Bvar%20script%20=%20document.createElement(%22script%22);script.src%20=%20%22https://raw.github.com/begriffs/css-ratiocinator/bookmarklet/extras/bookmarklet.js%22;document.getElementsByTagName(%22head%22)[0].appendChild(script);%7D());

## Contributing

It is currently very easy to contribute &mdash; all I want is your
complaints. Find something that the Ratiocinator does wrong and tell me.
The best complaints are very specific, preferably made into a new test
and submitted via a pull request. Luckily that's easy too:

1. Find some styles that the Ratiocinator is botching.
1. Think of the smallest example that will illustrate the problem.
1. Add a new test by copying `test/template.html` and filling in the blanks.
1. Save your new test in the `test/` folder.
1. Run `phantomjs test.js` and make sure it fails.
1. Submit pull request.

There are two known open bugs. Any contributions toward solving them
are also welcome.

1. Widths, heights, margins, etc are locked at particular pixel values
   ([Issue #8](https://github.com/begriffs/css-ratiocinator/issues/8))
1. Generated CSS doesn't yet include states like :hover or :visited
   ([Issue #7](https://github.com/begriffs/css-ratiocinator/issues/7))

## License

The CSS Ratiocinator is Copyright © 2012 Joe Nelson. It is free
software, and may be redistributed under the terms specified in the
LICENSE file.
