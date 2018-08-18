const y = {
  ...a, // a
  b: 2, // b
  d: 4, //d
  ...d, //d
  a: 1, //a
  c: 2 //c
};

const z = {
  // b
  b: 2,
  //d
  d: 4,
  /* d */
  ...d,
  /*a*/
  a: 1,
  /* c */
  c: 2, // c
  ...e /*e*/
};

const mapChild = (child) => ({
  ...child,
  x: 1,
  z: {
    /*
    b
    b
    b
    b
    */
    b: 2,
    d: 4,
    // d
    // d
    // d
    // d
    ...d,
    // a
    // a
    // a
    // a
    a: 1, /* a */
    c: 2,
    ...e
  },
  ...e,
  f: 1,
  k: 1,
  l: 1
});
