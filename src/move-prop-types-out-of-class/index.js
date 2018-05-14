const { isComponentDeclaration } = require('../node-utils');
const MoveStaticFieldOutOfClass = require('../move-static-field-out-of-class');

class MovePropTypesOutOfClass extends MoveStaticFieldOutOfClass {
  constructor() {
    super('propTypes', isComponentDeclaration);
  }
}

module.exports = MovePropTypesOutOfClass;
