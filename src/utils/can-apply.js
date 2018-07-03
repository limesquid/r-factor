const { isComponentDeclaration } = require('./ast');

const hasReactComponentExported = (ast) => someCanApply(ast, [
  isClassDeclaration,
  isFunctionalComponentDeclaration
]);


const someCanApply = (ast, predicates) => {
  let result = false;
  traverse(ast, {
    enter(path) {
      result = predicates.some((predicate) => predicate(path.node));
      if (result) {
        path.stop();
      }
    }
  });
  return result;
};

module.exports = {
  hasReactComponentExported,
  someCanApply
};
