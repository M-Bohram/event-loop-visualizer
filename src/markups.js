export const markup1 = `console.log("one");
console.log("two");`;

export const markup2 = `function three() {
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