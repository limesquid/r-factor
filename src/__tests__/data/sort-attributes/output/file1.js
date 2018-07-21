var x = { a: 1, b: 2 };

function a1() {
  let { a, b, ...rest } = x;
}

function a2() {
  let { a, ...rest } = x;
}

function a3() {
  let { b, ...rest } = x;
}

function a4() {
  let { ...rest } = x;
}
