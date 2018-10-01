const { createFileDetails, range, readFile } = require('./test-utils');
const settings = require('../settings');
const ConvertToArrowComponent = require('../refactorings/convert-to-arrow-component');

const types = [ 'class', 'function' ];
const files = [
  ...range(1, 14).map((n) => createFileDetails(`button${n}`)),
  createFileDetails('contact-us'),
  createFileDetails('meet-our-team'),
  createFileDetails('image-header', { indent: 4 }),
  createFileDetails('empty-indent-2'),
  createFileDetails('empty-indent-4', { indent: 4 }),
  createFileDetails('svg-icon', { indent: 4, 'trailing-commas': true })
];

describe('convert-to-arrow-component:refactor:react-imports', () => {
  const refactoring = new ConvertToArrowComponent();
  const tests = [
    {
      input: 'import React, { Component } from \'react\';',
      output: 'import React from \'react\';'
    },
    {
      input: 'import React, { Children, Component } from \'react\';',
      output: 'import React, { Children } from \'react\';'
    },
    {
      input: 'import React, { Children as X, Component } from \'react\';',
      output: 'import React, { Children as X } from \'react\';'
    }
  ];
  tests.forEach(({ input, output }, index) => {
    it(`refactor "${index}"`, () => {
      expect(refactoring.refactor(input)).toBe(output);
    });
  });
});

types.forEach((type) => {
  describe(`convert-to-arrow-component:${type}:canApply`, () => {
    const refactoring = new ConvertToArrowComponent();
    const tests = files.map(({ file }) => ({
      name: `${type}/${file}.js`,
      input: readFile(`${type}/${file}.js`),
      output: true
    }));
    if (type === 'class') {
      tests.push({
        name: 'non component class',
        input: 'class X {}',
        output: false
      });
    }
    tests.forEach(({ name, input, output }) => {
      it(`canApply "${name}"`, () => {
        expect(refactoring.canApply(input)).toBe(output);
      });
    });
  });

  describe(`convert-to-arrow-component:${type}:refactor`, () => {
    const refactoring = new ConvertToArrowComponent();
    const tests = files.map(({ file, additionalSettings }) => ({
      additionalSettings,
      name: `${type}/${file}.js -> arrow/${file}.js`,
      input: readFile(`${type}/${file}.js`),
      output: readFile(`arrow/${file}.js`)
    }));
    tests.forEach(({ additionalSettings, name, input, output }) => {
      it(`refactor "${name}"`, () => {
        settings.set(additionalSettings);
        const result = refactoring.refactor(input);
        settings.revert();
        expect(result).toBe(output);
      });
    });
  });
});
