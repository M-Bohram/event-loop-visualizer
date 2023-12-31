export const markup1 = `function three() {
  console.log("three");
}

function two() {
  console.log("two");
  setTimeout(function () {
    console.log("last");
  }, 1000);
  three();
}

function one() {
  console.log("one");
  two();
}

one();`;

export const markup2 = `setTimeout(function () {
  console.log("hello");
}, 1000);
  
function a() {
  console.log("a");

  function b() {
    console.log("b");
  }

  b();
}
  
console.log("hey");

setTimeout(function () {
  console.log("setTimeout");
}, 1600);

a();`;

export const markup3 = `console.log("one");
console.log("two");

function noInvocation() {
  console.log("no invocation");
}

function three() {
  console.log("three");

  function block() {
    console.log("block");
  }
}

three();

console.log("last");

block();`;