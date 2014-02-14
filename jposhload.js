/**
 *
 * jPoshLoad - https://github.com/martinkr/jPoshLoad
 *
 * jPoshLoad is an advanced animated preloader - think of flash-ish preloading with multiple instances.
 *
 * @Version: 2.0.2
 *
 *
 * Copyright (c) 2011-2014 Martin Krause (jquery.public.mkrause.info)
 * Dual licensed under the MIT and GPL licenses.
 *
 * @author Martin Krause public@mkrause.info
 * @copyright Martin Krause (jquery.public.mkrause.info)
 * @license MIT http://www.opensource.org/licenses/mit-license.php
 * @license GNU http://www.gnu.org/licenses/gpl-3.0.html
 *
 * @requires
 * 	jQuery JavaScript Library - http://jquery.com/
 * 		Copyright 2010, John Resig
 * 		Dual licensed under the MIT or GPL Version 2 licenses - http://jquery.org/license
 *
 * @example
 * jQuery(document).ready(function () {
 * 	 jQuery.fn.jPoshLoad('LoaderOne', {
 * 		forceNoCache: true,
 * 		images : ['src1','src2'],
 * 		headline: 'My First Loader' // << pass custom properties
 * 	});
 * 	 jQuery.fn.jPoshLoad('LoaderTwo', {
 * 		forceNoCache: false,
 * 		images : ['src3','src4'],
 * 		headline: 'My Second Loader' // << pass custom properties
 * 	});
 *
 */

/* jshint browser:true, jquery:true, strict: false, smarttabs:true, onevar:true, undef:true, unused:true, curly:true, latedef: true, sub:true */
/* global jQuery:true, -$:true */


;(function($) {

	/**
	* Contructor
	* @param  {String} sIdLoader_ Loader id
	* @param  {Object} oOptions_
	* {
	*	forceNoCache: false,
 	*	images : [{String}]
	* }
	* @return {Void}
	*/
	$.fn.jPoshLoad = function(sIdLoader_,oOptions_) {
			jQuery('html').addClass('jPoshLoad_completed-false');
			// build main options before element iteration
			var _oOpts = $.extend({}, $.fn.jPoshLoad.oDefaults, oOptions_),
				_$elWrapper  = jQuery($.fn.jPoshLoad.createLoaderHTML(sIdLoader_,_oOpts)),
				_oData = jQuery(document).data('jPoshload') || {},

				_aElements = oOptions_.images,
				_bForceNoCache = oOptions_.forceNoCache || false,
				_i
			;

			_oData[sIdLoader_] = {oOptions: _oOpts, iTotal: 0 , _aLoad: [], _aLoaded:[],$elWrapper:_$elWrapper};

			for (_i = 0; _i <_aElements.length; _i++) {
				_oData[sIdLoader_]._aLoad.push(_aElements[_i]);
			}

			_oData[sIdLoader_].iTotal = _oData[sIdLoader_]._aLoad.length;
			_oData[sIdLoader_].iLoaded = 0;

			jQuery(document).data('jPoshload',_oData);

			for (_i = 0; _i <_aElements.length; _i++) {
				_addItem(sIdLoader_,_bForceNoCache,_aElements[_i]);
			}

	};


	// private functions

	/**
	* Adds an item to the loading queue
	* @private
	* @param  {String} sIdLoader_ the current loader's id
	* @param {Bool} bForceNoCache_ Set to true if we should use a GET-Param to prevent caching images
	* @param {String} sSrc_			The Image source
	* @return {Void}
	*/
	function _addItem(sIdLoader_,bForceNoCache_,sSrc_) {
			// handle image

			var _elImage = document.createElement('img');

			jQuery(_elImage).on('load.jPoshLoad',{sIdLoader: sIdLoader_},$.fn.jPoshLoad.onLoadItem);

			_elImage.src = [sSrc_,(bForceNoCache_ ? ['?',++$.fn.jPoshLoad.UID].join('') : '' )].join('') ;

			// execute callback for cached images
			// opera and ie6 will not trigger the load event on those elements
			if ( _elImage.complete || _elImage.readyState === 4 ) {
				$.fn.jPoshLoad.onLoadItem({
					target: _elImage,
					data : {
						sIdLoader:sIdLoader_
					}
				});
			}

	}


	/**
	* Returns the number of images still not loaded completely
	* @private
	* @param  {String} sIdLoader_ Completed loader's id
	* @return {Number | undefined }	Images left to load or undefined if this laoder doesn't exist
	*/
	function _getStatus(sIdLoader_) {
		var _oData;
		if(jQuery(document).data('jPoshload') && jQuery(document).data('jPoshload')[sIdLoader_] ) {
			_oData = jQuery(document).data('jPoshload')[sIdLoader_];
		}
		return (_oData) ? _oData.iTotal - _oData.iLoaded : undefined ;
	}


	/**
	* Returns the number of images still not loaded completely
	* @private
	* @param  {String} sIdLoader_ Completed loader's id
	* @return {Number}	Images left to load
	*/
	function _updateState(sIdLoader_) {
		var _oData = jQuery(document).data('jPoshload')[sIdLoader_],
			_$elWrapper =  _oData.$elWrapper,
			_iTotal =  _oData.iTotal,
			_iLoaded =  _oData.iLoaded
		;

		$.fn.jPoshLoad.updateStatus(
			{
				sIdLoader: sIdLoader_ ,
				iTotal: _iTotal ,
				iLoaded: _iLoaded,
				$elWrapper:_$elWrapper
			}
		);

		if(_iLoaded === _iTotal) {
			$.fn.jPoshLoad.onComplete(sIdLoader_,_$elWrapper);
		}
	}


	// public vars
	$.fn.jPoshLoad.__version = '2.0.2'; // class version
	$.fn.jPoshLoad.__class = '$.fn.jPoshLoad'; // class name
	$.fn.jPoshLoad.UIDBase = new Date().getTime();
	$.fn.jPoshLoad.UID = $.fn.jPoshLoad.UIDBase;
	$.fn.jPoshLoad.sClassLoaded = 'jPoshLoad_loaded';

	// public functions

	/**
	* onLoad-callback for every image element
	* @param {Event} event_, DOM-event
	* @return {Void}
	*/
	$.fn.jPoshLoad.onLoadItem = function(event_) {
		var	_$element = jQuery(event_.target),
			_oData = jQuery(document).data('jPoshload'),
			_sIdLoader = event_.data.sIdLoader
		;

		_oData[_sIdLoader].iLoaded = _oData[_sIdLoader].iLoaded+1;
		 jQuery(document).data('jPoshload',_oData);

		_$element.off('load.jPoshLoad');
		_$element= null;

		// set status
		_updateState(_sIdLoader);

		return;
	};

	/**
	* Returns the number of images still not loaded completely
	* @param  {String} sIdLoader_ Completed loader's id
	* @return {Number | undefined }	Images left to load or undefined if this laoder doesn't exist
	*/
	$.fn.jPoshLoad.getStatus = function(sIdLoader_) {
		return _getStatus(sIdLoader_);
	};

	/**
	* Check if a specific loader is done with loading
	* @param  {String} sIdLoader_ Completed loader's id
	* @return {Bool}
	*/
	$.fn.jPoshLoad.isComplete = function(sIdLoader_) {
		var _status = _getStatus(sIdLoader_);
		return (_status === undefined) ? undefined : !_status;
	};

	/**
	 * OVERRIDE THESE FUNCTIONS!
	 */

	/**
	* Executed when all elements are completed
	* ATTENTION! Override with your own function!
	* @param  {String} sIdLoader_ the completed loader's id
	* @param  {jQuery-Element} $elWrapper_ HTML-loader's wrapper element
	* @return {Void}
	*/
	$.fn.jPoshLoad.onComplete = function (sIdLoader_,$elWrapper_) {
		jQuery('html').removeClass('jPoshLoad_completed-false');
		$elWrapper_.delay(1500).fadeOut();
	};

	/**
	* Updates the status elements
	* ATTENTION! Override with your own function!
	* @param  {Object} oOptions_ the current loaders properties {sIdLoader, iTotal, iLoaded, $elWrapper}
	* @return {Void}
	*/
	$.fn.jPoshLoad.updateStatus = function (oOptions_) {

		// animation and stuff
		oOptions_.$elWrapper.find('.bar')
			.stop(true,true)
			.animate( {'width' : [ Math.floor( (oOptions_.iLoaded / oOptions_.iTotal ) *100 ) ,'%'].join('')},1000);
			// console.log(oOptions_.iLoaded , ' / ', oOptions_.iTotal  ,  Math.floor( (oOptions_.iLoaded / oOptions_.iTotal ) *100 )  + "%")
	};

	/**
	* Creates HTML elements for the preloader
	* ATTENTION! Override with your own function!
	* @param  {String} sIdLoader_ the current loader's id
	* @param  {Object} oOptions_ the current loader's options
	* @return {jQuery-Element} It is important to return the loader's html wrapper. This will be stored and passed to you later (updateStatus etc).
	*/
	$.fn.jPoshLoad.createLoaderHTML = function (sIdLoader_,oOptions_) {
		jQuery('body')
			.append('<div id="html-'+sIdLoader_+'" style="padding: 5px 0 ;  background: #1e1e1e; color:#ddd; position: relative; top:0; left:0; z-index: 1000; height: 40px; width: 100%;">&nbsp;'+sIdLoader_+' - '+oOptions_.headline+'<div class="bar" style="height: 10px; width: 0%; background: red;"></div></div>');

		return jQuery('#html-'+sIdLoader_);
	};


	// set plugin defaults
	$.fn.jPoshLoad.oDefaults = {
		forceNoCache: false,
		images : []
	};

})(jQuery);




