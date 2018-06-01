const y = {
  ...a,
  b: 2,
  d: 4,
  ...d,
  a: 1,
  c: 2
};

const z = {
  b: 2,
  d: 4,
  ...d,
  a: 1,
  c: 2,
  ...e
};

const mapChild = (child) => ({
  ...child,
  x: 1,
  z: {
    b: 2,
    d: 4,
    ...d,
    a: 1,
    c: 2,
    ...e
  },
  ...e,
  f: 1,
  k: 1,
  l: 1
});
