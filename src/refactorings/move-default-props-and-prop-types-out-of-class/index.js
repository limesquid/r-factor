const { Refactoring } = require('../../model');
const MoveDefaultPropsOutOfClass = require('../move-default-props-out-of-class');
const MovePropTypesOutOfClass = require('../move-prop-types-out-of-class');

const moveDefaultPropsOutOfClass = new MoveDefaultPropsOutOfClass();
const movePropTypesOutOfClass = new MovePropTypesOutOfClass();

class MoveDefaultPropsAndPropTypesOutOfClass extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      (code) => moveDefaultPropsOutOfClass.refactor(code),
      (code) => movePropTypesOutOfClass.refactor(code)
    ];
  }

  canApply(code) {
    return moveDefaultPropsOutOfClass.canApply(code)
      || movePropTypesOutOfClass.canApply(code);
  }
}

module.exports = MoveDefaultPropsAndPropTypesOutOfClass;
