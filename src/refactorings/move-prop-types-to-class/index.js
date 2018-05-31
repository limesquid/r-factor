const { isComponentDeclaration } = require('../../utils/ast');
const MoveStaticFieldToClass = require('../move-static-field-to-class');

class MovePropTypesToClass extends MoveStaticFieldToClass {
  constructor() {
    super('propTypes', isComponentDeclaration);
  }
}

module.exports = MovePropTypesToClass;
