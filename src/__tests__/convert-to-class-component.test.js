const { createFileDetails, range, readFile } = require('./test-utils');
const settings = require('../settings');
const ConvertToClassComponent = require('../refactorings/convert-to-class-component');

const types = [ 'arrow', 'function' ];
const files = [
  ...[ ...range(1, 6), ...range(10, 13) ].map((n) => createFileDetails(`button${n}`)),
  createFileDetails('contact-us'),
  createFileDetails('meet-our-team'),
  createFileDetails('image-header', { indent: 4 }),
  createFileDetails('empty-indent-2'),
  createFileDetails('empty-indent-4', { indent: 4 }),
  createFileDetails('svg-icon', { indent: 4, 'trailing-commas': true }),
  createFileDetails('embed-node', { indent: 4, 'trailing-commas': true }),
  createFileDetails('with-user-context-hoc', { indent: 4, 'trailing-commas': true })
];

describe('convert-to-class-component:refactor:react-imports', () => {
  const refactoring = new ConvertToClassComponent();
  const tests = [
    {
      input: 'import React from \'react\';',
      output: 'import React, { Component } from \'react\';'
    },
    {
      input: 'import React, { Children } from \'react\';',
      output: 'import React, { Children, Component } from \'react\';'
    },
    {
      input: 'import React, { Children as X } from \'react\';',
      output: 'import React, { Children as X, Component } from \'react\';'
    }
  ];
  tests.forEach(({ input, output }, index) => {
    it(`refactor "${index}"`, () => {
      expect(refactoring.refactor(input)).toBe(output);
    });
  });
});

types.forEach((type) => {
  describe(`convert-to-class-component:${type}:canApply`, () => {
    const refactoring = new ConvertToClassComponent();
    const tests = files.map(({ file }) => ({
      name: `${type}/${file}.js`,
      input: readFile(`${type}/${file}.js`),
      output: true
    }));
    tests.forEach(({ name, input, output }) => {
      it(`canApply "${name}"`, () => {
        expect(refactoring.canApply(input)).toBe(output);
      });
    });
  });

  describe(`convert-to-class-component:${type}:refactor`, () => {
    const refactoring = new ConvertToClassComponent();
    const tests = files.map(({ file, additionalSettings }) => ({
      additionalSettings,
      name: `${type}/${file}.js -> class/${file}.js`,
      input: readFile(`${type}/${file}.js`),
      output: readFile(`class/${file}.js`)
    }));
    tests.forEach(({ additionalSettings, name, input, output }) => {
      it(`refactor "${name}"`, () => {
        settings.set(additionalSettings);
        expect(refactoring.refactor(input)).toBe(output);
        settings.revert();
      });
    });
  });
});
