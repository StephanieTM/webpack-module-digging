/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./cjs/bar.js":
/*!********************!*\
  !*** ./cjs/bar.js ***!
  \********************/
/***/ ((module, exports) => {



module.exports.sayHi = function () {
  return 'this is bar';
}

exports.hello = 'hello';


/***/ }),

/***/ "./cjs/index.js":
/*!**********************!*\
  !*** ./cjs/index.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var bar = __webpack_require__(/*! ./bar */ "./cjs/bar.js");

function foo() {
  return bar.sayHi();
}

module.exports = foo;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./cjs/index.js");
/******/ 	
/******/ })()
;