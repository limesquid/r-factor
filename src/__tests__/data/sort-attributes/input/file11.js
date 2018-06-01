const y = {
  ...a,
  d: 4,
  b: 2,
  ...d,
  c: 2,
  a: 1
};

const z = {
  d: 4,
  b: 2,
  ...d,
  c: 2,
  a: 1,
  ...e
};

const mapChild = (child) => ({
  ...child,
  z: {
    d: 4,
    b: 2,
    ...d,
    c: 2,
    a: 1,
    ...e
  },
  x: 1,
  ...e,
  l: 1,
  f: 1,
  k: 1
});
