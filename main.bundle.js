/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Cards = function () {
	  function Cards() {
	    _classCallCheck(this, Cards);
	
	    this.cards = Array.from(document.querySelectorAll('.card'));
	
	    this.onStart = this.onStart.bind(this);
	    this.onMove = this.onMove.bind(this);
	    this.onEnd = this.onEnd.bind(this);
	    this.update = this.update.bind(this);
	    this.targetBCR = null;
	    this.target = null;
	    this.startX = 0;
	    this.currentX = 0;
	    this.screenX = 0;
	    this.targetX = 0;
	    this.draggingCard = false;
	
	    this.addEventListeners();
	
	    requestAnimationFrame(this.update);
	  }
	
	  _createClass(Cards, [{
	    key: 'addEventListeners',
	    value: function addEventListeners() {
	      document.addEventListener('touchstart', this.onStart);
	      document.addEventListener('touchmove', this.onMove);
	      document.addEventListener('touchend', this.onEnd);
	
	      document.addEventListener('mousedown', this.onStart);
	      document.addEventListener('mousemove', this.onMove);
	      document.addEventListener('mouseup', this.onEnd);
	    }
	  }, {
	    key: 'onStart',
	    value: function onStart(e) {
	      if (this.target) return;
	
	      if (!e.target.classList.contains('card')) return;
	
	      this.target = e.target;
	      this.targetBCR = this.target.getBoundingClientRect();
	
	      this.startX = e.pageX || e.touches[0].pageX;
	      this.currentX = this.startX;
	
	      this.draggingCard = true;
	      this.target.style.willChange = 'transform';
	
	      e.preventDefault();
	    }
	  }, {
	    key: 'onMove',
	    value: function onMove(e) {
	      if (!this.target) return;
	
	      this.currentX = e.pageX || e.touches[0].pageX;
	    }
	  }, {
	    key: 'onEnd',
	    value: function onEnd(e) {
	      if (!this.target) return;
	
	      this.targetX = 0;
	      var screenX = this.currentX - this.startX;
	      var threshold = this.targetBCR.width * 0.35;
	      if (Math.abs(screenX) > threshold) {
	        this.targetX = screenX > 0 ? this.targetBCR.width : -this.targetBCR.width;
	      }
	
	      this.draggingCard = false;
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	
	      requestAnimationFrame(this.update);
	
	      if (!this.target) return;
	
	      if (this.draggingCard) {
	        this.screenX = this.currentX - this.startX;
	      } else {
	        this.screenX += (this.targetX - this.screenX) / 4;
	      }
	
	      var normalizedDragDistance = Math.abs(this.screenX) / this.targetBCR.width;
	      var opacity = 1 - Math.pow(normalizedDragDistance, 3);
	
	      this.target.style.transform = 'translateX(' + this.screenX + 'px)';
	      this.target.style.opacity = opacity;
	
	      if (this.draggingCard) return;
	
	      var isNearlyAtStart = Math.abs(this.screenX) < 0.1;
	      var isNearlyInvisible = opacity < 0.01;
	
	      if (isNearlyInvisible) {
	
	        if (!this.target || !this.target.parentNode) return;
	
	        this.target.parentNode.removeChild(this.target);
	
	        var targetIndex = this.cards.indexOf(this.target);
	        this.cards.splice(targetIndex, 1);
	
	        this.animateOtherCardsIntoPosition(targetIndex);
	      } else if (isNearlyAtStart) {
	        this.resetTarget();
	      }
	    }
	  }, {
	    key: 'animateOtherCardsIntoPosition',
	    value: function animateOtherCardsIntoPosition(startIndex) {
	      var _this = this;
	
	      if (startIndex === this.cards.length) {
	        this.resetTarget();
	        return;
	      }
	
	      var onAnimationComplete = function onAnimationComplete(e) {
	        var card = e.target;
	        card.removeEventListener('transitionend', onAnimationComplete);
	        card.style.transition = '';
	        card.style.transform = '';
	
	        _this.resetTarget();
	      };
	
	      for (var i = startIndex; i < this.cards.length; i++) {
	        var card = this.cards[i];
	
	        card.style.transform = 'translateY(' + (this.targetBCR.height + 20) + 'px)';
	        card.addEventListener('transitionend', onAnimationComplete);
	      }
	
	      requestAnimationFrame(function (_) {
	        for (var _i = startIndex; _i < _this.cards.length; _i++) {
	          var _card = _this.cards[_i];
	
	          _card.style.transition = 'transform 150ms cubic-bezier(0,0,0.31,1) ' + _i * 50 + 'ms';
	          _card.style.transform = '';
	        }
	      });
	    }
	  }, {
	    key: 'resetTarget',
	    value: function resetTarget() {
	      if (!this.target) return;
	
	      this.target.style.willChange = 'initial';
	      this.target.style.transform = 'none';
	      this.target = null;
	    }
	  }]);
	
	  return Cards;
	}();
	
	window.addEventListener('load', function () {
	  return new Cards();
	});

/***/ }
/******/ ]);
//# sourceMappingURL=main.bundle.js.map