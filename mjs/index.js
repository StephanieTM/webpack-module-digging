import d, { sayHi, hello } from './bar';

function foo() {
  const s = d + hello;
  console.log('s :>> ', s);
  return sayHi();
}

export default foo;
