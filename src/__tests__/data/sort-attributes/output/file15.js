const checkIsConnected = (ast) => {
  let isConnected = false;
  traverse(ast, {
    CallExpression(path) {
      if (path.node.callee.name === 'connect') {
        isConnected = true;
        path.stop();
      }
    },
    Identifier(path) {
      path.stop();
    }
  });
  return isConnected;
}
