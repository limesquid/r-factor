const refactorings = [
  'add-classname',
  'connect',
  'connect-map-state-to-props',
  'connect-map-dispatch-to-props',
  'connect-merge-props',
  'convert-to-class-component',
  'convert-to-arrow-component',
  'convert-to-function-component',
  'disconnect',
  'disconnect-map-state-to-props',
  'disconnect-map-dispatch-to-props',
  'disconnect-merge-props',
  'generate-prop-types',
  'move-default-props-out-of-class',
  'move-default-props-to-class',
  'move-prop-types-out-of-class',
  'move-prop-types-to-class',
  'sort-attributes',
  'sort-imports',
  'toggle-component-type',
  'toggle-with-router-hoc'
];

module.exports = refactorings.reduce((map, name) => ({
  ...map,
  [name]: require(`./${name}`)
}));
