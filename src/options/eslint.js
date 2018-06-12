module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
    ecmaFeatures: {
      classes: true,
      jsx: true
    }
  },
  envs: [ 'browser' ],
  useEslintrc: false,
  plugins: [ 'react' ]
};
