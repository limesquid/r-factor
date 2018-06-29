const getComponentExportDetails = require('../utils/component-export-details');
const parser = require('../utils/parser');
const settings = require('../settings');

const changeComponentExport = (source, ast = parser.parse(source), options) => {
  const { componentNameCollisionPattern } = settings;
  const {
    preferableName = settings.defaultComponentName,
    componentDetails = getComponentExportDetails(ast),
    defaultExport = true
  } = options;


  changeToDefaultExport(source, ast, details);
};

const changeToDefaultExport(source, ast, details) {
  
}

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
  const { defaultComponentName } = settings;
  const {
    componentExportPath,
    isInstantExport,
    originalComponentName
  } = details;

  // if (!isInstantExport) {
  //   componentExportPath.remove();
  //   return;
  // }

  const componentDeclaration = componentExportPath.node.declaration;
  if (originalComponentName) {
    // const componentCode = `const Component = ${this.code.slice(componentDeclaration.start, componentDeclaration.end)}`;
    // componentExportPath.replaceWith(
      // parser.parse(componentCode).program.body[0]
    // );
  } else {
    const componentDeclaration = variableDeclaration()
    componentExportPath.replaceWith()
  }
};

module.exports = removeImportDeclaration;
