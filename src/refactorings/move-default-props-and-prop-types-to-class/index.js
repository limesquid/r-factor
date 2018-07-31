const { Refactoring } = require('../../model');
const MoveDefaultPropsToClass = require('../move-default-props-to-class');
const MovePropTypesToClass = require('../move-prop-types-to-class');

const moveDefaultPropsToClass = new MoveDefaultPropsToClass();
const movePropTypesToClass = new MovePropTypesToClass();

class MoveDefaultPropsAndPropTypesToClass extends Refactoring {
  constructor() {
    super();
    this.transformations = [
      (code) => moveDefaultPropsToClass.refactor(code),
      (code) => movePropTypesToClass.refactor(code)
    ];
  }

  canApply(code) {
    return moveDefaultPropsToClass.canApply(code)
      || movePropTypesToClass.canApply(code);
  }
}

module.exports = MoveDefaultPropsAndPropTypesToClass;
