/**
 *
 * jPoshLoad - https://github.com/martinkr/jPoshLoad
 *
 * jPoshLoad is an advanced animated preloader - think of flash-ish preloading.
 *
 * @Version: 0.9b
 *
 *
 * Copyright (c) 2011-2012 Martin Krause (jquery.public.mkrause.info)
 * Dual licensed under the MIT and GPL licenses.
 *
 * @author Martin Krause public@mkrause.info
 * @copyright Martin Krause (jquery.public.mkrause.info)
 * @license MIT http://www.opensource.org/licenses/mit-license.php
 * @license GNU http://www.gnu.org/licenses/gpl-3.0.html
 *
 * @requires
 *  jQuery JavaScript Library - http://jquery.com/
 *    Copyright 2010, John Resig
 *    Dual licensed under the MIT or GPL Version 2 licenses - http://jquery.org/license
 *
 * @example

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
 */

 /* @jslint 2012-06-13*/
 /* jslint devel: true, browser: true, confusion: true, undef: true, node: false, continue: true, rhino: false, debug: false, sloppy: true, widget: false, eqeq: false, sub: true, windows: true, vars: true, evil: true, white: true, forin: true, css: true, cap: true, nomen: true, plusplus: true, maxerr: 50, indent: 4*/


(function($) {

	/**
	* Contructor
	* @param  {String} sIdLoader_ Loader id
	* @param  {Object} oOptions_
	* {
	* 	forceNoCache: false,
	* 	sTextHeadline : 'Loading...',
	* 	images : {
	* 		 id: {STRING}
	* 		 src: {STRING}
	* 	}
	* }
	* @return {Void}
	*/
	$.fn.jPoshLoad = function(sIdLoader_,oOptions_) {
			jQuery('html').addClass('jPoshLoad_completed-false');
			// build main options before element iteration
			var _oOpts = $.extend({}, $.fn.jPoshLoad.oDefaults, oOptions_);

			var _$elWrapper  = _createHTMLWrapper(sIdLoader_,_oOpts.sTextHeadline);
			var _oData = {};
			_oData[sIdLoader_] = {oOptions: _oOpts, _aLoad: [], _aLoaded:[],$elWrapper:_$elWrapper};

			var _oElements = oOptions_.images;
			var _sForceNoCache = oOptions_.forceNoCache || false;
			var _oElement;

			for (_oElement in _oElements) {
				if (!_oElements[_oElement]['id'] ) {
					_oElements[_oElement]['id']=['jPoshload_',++$.fn.jPoshLoad.UID].join('');
				}
				// create status item html
				_$elWrapper.append('<li class=""></li>');
				_oData[sIdLoader_]._aLoad.push(_oElements[_oElement]['id']);
			}

			$(document).data('jPoshload',_oData);

			_$elWrapper
				.find('.jPoshLoad_counter')
					.text(['0 / ',_$elWrapper.find('li').size()].join(''))
				.end()
				.find('.jPoshload_percentage')
					.text('0%')
				.end();

			for (_oElement in _oElements) {
				_addItem(sIdLoader_,_sForceNoCache,_oElements[_oElement]);
			}

	};


	// private functions

	/**
	* Adds plugin / class specific events.
	* @private
	* @param  {String} sIdLoader_ Completed loader's id
	* @param {Bool} sForceNoCache_ Use a GET-Param to prevent caching images
	* @param {Object} oElement_      Items's options
	* @return {Void}
	*/
	function _addItem(sIdLoader_,sForceNoCache_,oElement_) {
			// handle image
			var _sSrc = oElement_.src;

			var _elImage = document.createElement('img');
			jQuery(_elImage).bind('load.jPoshLoad',{sIdElement:oElement_.id,sIdLoader: sIdLoader_},$.fn.jPoshLoad.onLoadItem);

			_elImage.src = [_sSrc,(sForceNoCache_ ? ['?',oElement_.id,'-',$.fn.jPoshLoad.UID].join('') : '' )].join('') ;
			// execute callback for cached images
			// opera and ie6 will not trigger the load event on those elements
			if ( _elImage.complete || _elImage.readyState === 4 ) {
				$.fn.jPoshLoad.onLoadItem({
					target: _elImage,
					data : {
						sIdLoader:sIdLoader_,
						sIdElement:oElement_.id
					}
				});
			}

	}

	/**
	* Executed when all elements are completed
	* @private
	* @param  {String} sIdLoader_ Completed loader's id
	* @param  {jQuery-Element} $elWrapper_ The loader's wrapper element
	* @return {Void}
	*/
	function _doOnComplete(sIdLoader_,$elWrapper_) {
		// if (jQuery('html').hasClass('jPoshLoad_completed-false') === false) {
		// 	// poll for onloadItem complete
		// 	window.setTimeout(function(){
		// 		$.fn.jPoshLoad.onComplete(sIdLoader_);
		// 	},100);
		// 	return;
		// }

		if ( jQuery('html').hasClass('jPoshLoad_completed-false') === false ) {return;}
		jQuery('html').removeClass('jPoshLoad_completed-false');

		// reset or hide
		$elWrapper_
			.fadeOut(1000);
			//.remove()
			// .find('.jPoshLoad_counter')
			// 	.text([''].join(''))
			// .end()
			// 	.find('.jPoshload_percentage')
			// 	.width('0%')
			// .end();
	}


	/**
	* Adds plugin / class specific events.
	* @return {HTMLElement}
	* @private
	*/
	function _createHTMLWrapper(sId_,sTextHeadline_) {
		return jQuery(['#',sId_].join('')).append('<div class="jPoshLoad_wrapper"><h1>'+sTextHeadline_+'</h1><span class="jPoshLoad_counter"></span><span class="jPoshload_percentage"></span><ol id="jPoshLoad_'+sId_+'"></ol></div>');

	}



	// public functions
	/**
	* onComplete callback - triggered when every element has been loaded
	* @param  {String} sIdLoader_ Completed loader's id
	* @return {Void}
	*/
	$.fn.jPoshLoad.onComplete = function (sIdLoader_) {
		_doOnComplete(sIdLoader_,$(document).data('jPoshload')[sIdLoader_].$elWrapper);
	};

	/**
	* Updates the status elements
	* @param  {String} sIdLoader_ Current loader's id
	* @return {Void}
	*/
	$.fn.jPoshLoad.updateStatus = function (sIdLoader_) {
		var _$elWrapper =  $(document).data('jPoshload')[sIdLoader_].$elWrapper;
		// var _$elWrapper  = jQuery(['#',sIdLoader_].join(''))
		var _$elLi = _$elWrapper.find('li');
		var _$elLiNotLoaded = _$elLi.not('.loaded');
		_$elLiNotLoaded
				.eq(0)
					.addClass('loaded');

		_$elLiNotLoaded = _$elWrapper.find('li').not('.loaded');

		// animation and stuff
		_$elWrapper

			.find('.jPoshLoad_counter')
				.text([_$elLi.size()-_$elLiNotLoaded.size(),' / ',_$elLi.size()].join(''))
			.end()
			// use css3 if  necessary
			.find('.jPoshload_percentage')
				.stop()
				.animate({'width' : [ Math.floor( ( ( _$elLi.size() - _$elLiNotLoaded.size() )*100 ) / _$elLi.size() ),'% '].join('')} )
			.end();

		// everonyes finally loaded call onComplete
		// if( $(document).data('jPoshload')[sIdLoader_]._aLoad.lenght === 0) {
		if(_$elLiNotLoaded.size() === 0) {
			_doOnComplete(sIdLoader_,_$elWrapper);
		}
	};


	/**
	* onLoadItem callback for the image element
	* @param {Event} event_, DOM-event
	* @return {Void}
	*/
	$.fn.jPoshLoad.onLoadItem = function(event_) {
		var _i;
		var _iIndex;
		var _evtElement = jQuery(event_.target);

		// update
		var _oData = $(document).data('jPoshload');
		var _aLoad = _oData[event_.data.sIdLoader]._aLoad;


		_oData[event_.data.sIdLoader]._aLoaded.push(event_.data.sIdElement);

		_evtElement.unbind('load.jPoshLoad');

		// get current item's position in controll array
		for (_i=0;_i<_aLoad.length; _i++) {
			if (_aLoad[_i] == event_.data.sIdElement) {
				_iIndex = _i;
				break;
			}
		}

		// remove current item
		_oData[event_.data.sIdLoader]._aLoad =_aLoad.slice(0,_iIndex).concat( _aLoad.slice(_iIndex+1) );
		 $(document).data('jPoshload',_oData);

		_evtElement= null;

		// set status
		$.fn.jPoshLoad.updateStatus(event_.data.sIdLoader);

		// notify other elements
		jQuery('document').triggerHandler('jPoshLoad;load;element',{element:event_.target, id: event_.data.sIdElement});

		return;
	};


	// plugin defaults

	$.fn.jPoshLoad.__version = 1.1; // class version
	$.fn.jPoshLoad.__class = '$.fn.jPoshLoad'; // class name
	$.fn.jPoshLoad.UIDBase = new Date().getTime();
	$.fn.jPoshLoad.UID = $.fn.jPoshLoad.UIDBase;
	$.fn.jPoshLoad.sClassLoaded = 'jPoshLoad_loaded';


	// plugin defaults
	$.fn.jPoshLoad.oDefaults = {
		forceNoCache: false,
		sTextHeadline : 'Loading...',
		images : {
			/**
			 id: {STRING}
			 src: {STRING}
			*/
		}

	};
})(jQuery);





