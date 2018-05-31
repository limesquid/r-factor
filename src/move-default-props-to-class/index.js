const { isComponentDeclaration } = require('../utils/ast');
const MoveStaticFieldToClass = require('../move-static-field-to-class');

class MoveDefaultPropsToClass extends MoveStaticFieldToClass {
  constructor() {
    super('defaultProps', isComponentDeclaration);
  }
}

module.exports = MoveDefaultPropsToClass;
