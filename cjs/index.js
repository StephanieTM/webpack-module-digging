'use strict';

var bar = require('./bar');

function foo() {
  return bar.sayHi();
}

module.exports = foo;

// foo();
