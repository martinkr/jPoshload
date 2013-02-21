<a name="README">[jPoshLoad](https://github.com/martinkr/jPoshLoad)</a>
=======
**jPoshLoad is an advanced animated preloader - think of flash-ish preloading.**

## Example

	jQuery(document).ready(function(){
		 $.fn.jPoshLoad('test1', {
			forceNoCache: true,
			images : {
				image1: {
					id: 'X',
					src: 'http://www.ipad3wallpapers.com/wp-content/uploads/2012/04/iPad-3-Wallpaper-Pattern-01.jpg'
				},
				image2: {
					id: 'Y',
					src: 'http://www.ipad3wallpapers.com/wp-content/uploads/2012/04/iPad-3-Wallpaper-Pattern-02.jpg'
				},
				image3: {
					id: null,
					src: 'http://www.ipad3wallpapers.com/wp-content/uploads/2012/04/iPad-3-Wallpaper-Pattern-03.jpg'
				},
				image4: {
					id: null,
				src: 'http://www.ipad3wallpapers.com/wp-content/uploads/2012/04/iPad-3-Wallpaper-Pattern-04.jpg'
				},
				image5: {
					id: null,
					src: 'http://www.ipad3wallpapers.com/wp-content/uploads/2012/04/iPad-3-Wallpaper-Pattern-05.jpg'
				},
				image6: {
					id: null,
					src: 'http://www.ipad3wallpapers.com/wp-content/uploads/2012/04/iPad-3-Wallpaper-Pattern-06.jpg'
				}
			}
		});
	})

## Requires
 * jQuery JavaScript Library - http://jquery.com/; Copyright 2010, John Resig; Dual licensed under the MIT or GPL Version 2 licenses - http://jquery.org/license

## License
Dual licensed under the MIT and GPL licenses.

* MIT - http://www.opensource.org/licenses/mit-license.php
* LGPL-3.0 - http://opensource.org/licenses/lgpl-3.0.html

Copyright (c) 2011-2012 Martin Krause (jquery.public.mkrause.info)
