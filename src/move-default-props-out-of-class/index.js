const { isComponentDeclaration } = require('../utils/ast');
const MoveStaticFieldOutOfClass = require('../move-static-field-out-of-class');

class MoveDefaultPropsOutOfClass extends MoveStaticFieldOutOfClass {
  constructor() {
    super('defaultProps', isComponentDeclaration);
  }
}

module.exports = MoveDefaultPropsOutOfClass;
