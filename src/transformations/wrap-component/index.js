const {
  callExpression,
  identifier
} = require('@babel/types');
const parser = require('../../utils/parser');
const getComponentExportDetails = require('../../utils/component-export-details');
const settings = require('../../settings');

const wrapComponent = (code, ast = parser.parse(code),  options) => {
  const { name, import: importDetails, invoke, outermost = false } = options;
  const details = getComponentExportDetails(ast);
  const isExported = Boolean(details.componentExportPath);

  if (isExported) {
    removeExportStatement(ast, details);
  }

  if (isExported && !details.isDefaultExport) {
    renameComponent(ast, details);
  }

  wrapComponentInHoc(ast, details, { name, invoke, outermost });

  return parser.print(ast);
};

const buildWraperAst = (name, invoke, componentIdentifier) => {
  let callee = identifier(name);

  if (invoke) {
    callee = callExpression(
      identifier(name),
      invoke.map((argument) => identifier(argument))
    );
  }

  return callExpression(callee, [ componentIdentifier ]);
};

const wrapComponentInHoc = (ast, details, { name, invoke, outermost }) => {
  const { closestHoCPath, componentIdentifierInHoC } = details;
  const isAlreadyWrapped = Boolean(closestHoCPath);

  if (isAlreadyWrapped) {
    closestHoCPath.node.arguments = closestHoCPath.node.arguments.map(
      (argument) => argument === componentIdentifierInHoC
        ? buildWraperAst(name, invoke, componentIdentifierInHoC)
        : argument
    );
  }
};

const renameComponent = (ast, details) => {
  const { componentNameCollisionPattern: namePattern } = settings;
  const {
    classComponentPath,
    functionalComponentPath,
    originalComponentName
  } = details;
  const newComponentName = namePattern.replace('${name}', originalComponentName);

  if (functionalComponentPath) {
    functionalComponentPath.scope.rename(originalComponentName, newComponentName);
  } else {
    classComponentPath.scope.rename(originalComponentName, newComponentName);
  }
};

const removeExportStatement = (ast, details) => {
  const {
    componentExportPath,
    isInstantExport,
    originalComponentName
  } = details;

  if (isInstantExport) {
    componentExportPath.remove();
    return;
  }

  // const componentDeclaration = componentExportPath.node.declaration;
  if (originalComponentName) {
    // const componentCode = `const Component = ${this.code.slice(componentDeclaration.start, componentDeclaration.end)}`;
    // componentExportPath.replaceWith(
      // parser.parse(componentCode).program.body[0]
    // );
  }
};

module.exports = wrapComponent;
