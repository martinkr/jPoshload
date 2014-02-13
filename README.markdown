<a name="README">[jPoshLoad](https://github.com/martinkr/jPoshLoad)</a>
=======
**jPoshLoad is an advanced animated preloader - think of flash-ish preloading.**


## API
```JavaScript
	jQuery.fn.jPoshLoad({ID as String}, {
			images : {An Array of Strings pointing to your image sources}, // required!
			forceNoCache: {Boolean, set to true if you want to prevent image caching}, // optional, default: false
			// set custom properties which will be passed to all your functions, e.g. custom text
			headline: 'My First Loader' // << pass custom properties
			text: ' ...'
		});
```

**jQuery.fn.jPoshLoad.getStatus**
Returns the number of images still not loaded completely
* @param  {String} sIdLoader_ Completed loader's id
* @return {Number} Images left to load

**jQuery.fn.jPoshLoad.getStatus**
* Check if a specific loader is done with loading
* @param  {String} sIdLoader_ Completed loader's id
* @return {Bool}


## Example
```JavaScript
	jQuery(document).ready(function(){

		jQuery.fn.jPoshLoad('LoaderOne', {
			images : ['src1','src2'],
			forceNoCache: true,
			headline: 'My First Loader'
		});

		jQuery.fn.jPoshLoad('LoaderTwo', {
			images : ['src3','src4'],
			forceNoCache: true,
			headline: 'My Second Loader'
		});

	})
```

### Override these functions to match your page

**$.fn.jPoshLoad.onComplete**
Executed when all elements are completed.
Add some code that removes or hides your laoder and starts your application.
* @param  {String} sIdLoader_ the completed loader's id
* @param  {jQuery-Element} elWrapper_ HTML-loader's wrapper element
* @return {Void}


**$.fn.jPoshLoad.updateStatus**
Updates the loader's status
Add some code to match your loader, e.g. update the text (2 of 10, 20%, etc) or play an animation.
* @param  {Object} oOptions_ the current loaders properties {sIdLoader, iTotal, iLoaded, $elWrapper}
* @return {Void}


**$.fn.jPoshLoad.updateStatus**
Creates HTML elements for the preloader
This Element will be stored and passed to you later on (updateStatus, onComplete).
* @param  {String} sIdLoader_ the current loader's id
* @param  {Object} oOptions_ the current loader's options
* @return {jQuery-Element} It is important to return the loader's html wrapper. This will be stored and passed to you later (updateStatus etc).



## Requires
* jQuery JavaScript Library - http://jquery.com/; Copyright 2010, John Resig; Dual licensed under the MIT or GPL Version 2 licenses - http://jquery.org/license

## License
Dual licensed under the MIT and GPL licenses.

* MIT - http://www.opensource.org/licenses/mit-license.php
* LGPL-3.0 - http://opensource.org/licenses/lgpl-3.0.html

Copyright (c) 2011-2012 Martin Krause (jquery.public.mkrause.info)
