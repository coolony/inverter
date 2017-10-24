Inverter
========

Simply flips LTR-based CSS file to RTL, or the opposite, in pure javascript, using a bunch of regular expressions. Can be both used on the server-side with Node.js, or client-side. This package has been inspired by Google's great [CSSJanus](http://code.google.com/p/cssjanus/).


Basic Usage
-----------

```javascript
var inverter = require('inverter');
  , inverted_css = inverter.invert('.some_css_class { margin: 8px 3px 9px 2px; float: left; }')
```

You may optionally want to prevent some filters from running:

```javascript
var inverter = require('inverter');
  , inverted_css = inverter.invert(myCSS, {exclude: ['fixGradient']))
```


Inverter will
-------------

* **fixLeftRight**: Replace `left` with `right` and the opposite, but:
  * No replacement will be made between parentheses (`background-image: url(bright-left.png)` will be left intact)
  * No replacement will be made in selectors (`.block-left { […] }` will be left intact)
  
* **fixBodyDirection**: Replace `direction: ltr` with `direction: rtl` and the opposite, only for the body tag

* **fixCursor**: Replace, for example, `cursor: nw-resize` with `cursor: ne-resize`

* **fixBorderRadius**: Fix `border-radius` definitions, so `border-radius: 5px 2px 4px / 9px 2px` will become `border-radius: 2px 5px 2px 4px / 2px 9px`

* **fixFourPartNotation**: Fixes four part notation, so, for example, `border: 1px 2px 3px 4px` will be rewritten to `border: 1px 4px 3px 2px`. As it can interfere with *fixBorderRadius*, `border-radius` is explicitely excluded from the scope of this fix

* **fixGradient**: Fixes most common CSS gradient definitions. This fix will replace `left` with `right`, `XXXdeg` with `-XXXdeg` and the opposites inside gradients.

* **fixUrlLeftRight**: Changes URLs containing a standalone `left` or `right`. For example, `url(menu-right.png)` will be changed to `url(menu-left.png)`, but `url(menu-bright.png)` will be left intact.

* **fixUrlLtrRtl**: Same as *fixUrlLeftRight*, but for `ltr` and `rtl`.


Todo
----

Add a fix for background images.


Tests
-----

This package is tested using [Mocha](http://mochajs.org/). To run the tests, run `npm install` inside the package directory to install development dependencies, and then simply `make test`.
