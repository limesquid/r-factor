var x = { b: 2, a: 1 };

function a1() {
  let { b, a, ...rest } = x;
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
