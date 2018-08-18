const y = {
  ...a, // a
  d: 4, //d
  b: 2, // b
  ...d, //d
  c: 2, //c
  a: 1 //a
};

const z = {
  //d
  d: 4,
  // b
  b: 2,
  /* d */
  ...d,
  /* c */
  c: 2, // c
  /*a*/
  a: 1,
  ...e /*e*/
};

const mapChild = (child) => ({
  ...child,
  z: {
    d: 4,
    /*
    b
    b
    b
    b
    */
    b: 2,
    // d
    // d
    // d
    // d
    ...d,
    c: 2,
    // a
    // a
    // a
    // a
    a: 1, /* a */
    ...e
  },
  x: 1,
  ...e,
  l: 1,
  f: 1,
  k: 1
});
