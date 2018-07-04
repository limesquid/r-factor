const checkIsConnected = (ast) => {
  let isConnected = false;
  traverse(ast, {
    Identifier(path) {
      path.stop();
    },
    CallExpression(path) {
      if (path.node.callee.name === 'connect') {
        isConnected = true;
        path.stop();
      }
    }
  });
  return isConnected;
}
